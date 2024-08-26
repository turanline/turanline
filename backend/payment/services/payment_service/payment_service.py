import logging
from collections import OrderedDict
from typing import Any, Dict, Optional

import requests
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from cart import enums as cart_enums
from cart import models as cart_models
from users import models as user_models

from ..hash_service import hash_service

logger = logging.getLogger(__name__)


class PaymentService:

    def __init__(self) -> None:
        self.hash_service = hash_service.HashService(
            store_key=settings.STORE_KEY
        )

    def _post_request_to_payment_gateway(
        self,
        data: Dict[str, Any]
    ) -> requests.Response:
        return requests.post(
            settings.PAYMENT_URL,
            data=data
        )

    def _after_success_payment_order(
        self,
        order: cart_models.Order,
        masked_pan: str
    ) -> None:
        order.is_paid = True
        order.payment = masked_pan
        order.status = cart_enums.OrderStatuses.PROCESSED
        order.created_date = timezone.now()
        order.save(
            update_fields=[
                'is_paid',
                'payment',
                'status',
                'created_date'
            ]
        )

    def _after_fail_payment_order(
        self,
        order: cart_models.Order
    ) -> None:
        order.delete()

    def _get_order_by_oid(
        self,
        oid: str
    ) -> cart_models.Order:
        return cart_models.Order.objects.get(
            order_id=oid
        )

    def process_payment(
        self,
        user: user_models.User,
        data: OrderedDict[str, str],
        url_paths: Dict[str, str]
    ) -> requests.Response:
        micro_time = self.hash_service._get_micro_time()
        order = cart_models.Order.objects.filter(
            customer=user.customer,
            status=cart_enums.OrderStatuses.CREATED,
            is_paid=False
        ).last()

        payment_gateway_data = {
            'clientId': settings.CLIENT_ID,
            'oid': order.order_id,
            'amount': order.total_sum,
            'okUrl': url_paths['success_url'],
            'failUrl': url_paths['fail_url'],
            'islemtipi': 'Auth',
            'instalment': '',
            'rnd': micro_time,
            'storekey': settings.STORE_KEY,
            'storetype': '3d_pay_hosting',
            'pan': data['card_number'],
            'Ecom_Payment_Card_ExpDate_Year': data['expiration_year'],
            'Ecom_Payment_Card_ExpDate_Month': data['expiration_month'],
        }
        payment_gateway_data['hash'] = self.hash_service._generate_hash(
            **payment_gateway_data
        )
        response = self._post_request_to_payment_gateway(
            data=payment_gateway_data
        )

        return response

    def process_payment_success(
        self,
        data: Dict[str, Any]
    ) -> Optional[HttpResponseRedirect]:
        try:
            payment_data = {key: value[0] for key, value in data.lists()}
            validated = self.hash_service._verify_hash(
                data=payment_data
            )
            if not validated:
                raise ValidationError(
                    {'detail': 'Invalid hash. Payment validation failed.'}
                )
            order = self._get_order_by_oid(
                oid=data['oid']
            )
            self._after_success_payment_order(
                order=order,
                masked_pan=data['MaskedPan']
            )
            return HttpResponseRedirect(
                redirect_to=settings.FRONTEND_PAYMENT_SUCCESS_URL
            )
        except Exception as error:
            logger.error(error)
            raise error

    def process_payment_fail(
        self,
        data: Dict[str, Any]
    ) -> Optional[HttpResponseRedirect]:
        try:
            payment_data = {key: value[0] for key, value in data.lists()}
            order = self._get_order_by_oid(
                oid=data['oid']
            )
            self._after_fail_payment_order(
                order=order
            )
            validated = self.hash_service._verify_hash(
                data=payment_data
            )
            if not validated:
                raise ValidationError(
                    {'detail': 'Payment validation failed.'}
                )
            return HttpResponseRedirect(
                redirect_to=settings.FRONTEND_PAYMENT_FAIL_URL
            )
        except Exception as error:
            logger.error(error)
            raise error
