from typing import Any, Type, Union

from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from customers import permissions as customer_permissions

from . import serializers, services


class CardPaymentViewSet(viewsets.GenericViewSet):

    serializer_class = serializers.CardPaymentSerializer
    permission_classes = [
        customer_permissions.IsCustomerPermission
    ]

    def initial(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> None:
        super().initial(request, *args, **kwargs)
        self.payment_service = services.PaymentService()

    def get_serializer_class(
        self
    ) -> Type[
        Union[
            Serializer,
            serializers.CardPaymentSerializer
        ]
    ]:
        if not self.action == 'process_payment':
            return Serializer
        return super().get_serializer_class()

    @action(methods=['POST'], detail=False)
    def process_payment_by_company_details(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        self.payment_service.process_payment_by_company_details(
            user=request.user
        )
        return Response(
            status=status.status.HTTP_200_OK
        )

    @action(methods=['POST'], detail=False)
    def process_payment(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        response = self.payment_service.process_payment(
            user=request.user,
            data=serializer.validated_data
        )
        return Response(
            data=response.text,
            status=response.status_code
        )

    @action(
        methods=['POST'],
        detail=False,
        permission_classes=[
            AllowAny
        ]
    )
    def payment_success(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> HttpResponseRedirect:
        try:
            return self.payment_service.process_payment_success(
                data=request.data
            )
        except Exception:
            return HttpResponseRedirect(
                redirect_to=settings.FRONTEND_PAYMENT_FAIL_URL
            )

    @action(
        methods=['POST'],
        detail=False,
        permission_classes=[
            AllowAny
        ]
    )
    def payment_fail(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> HttpResponseRedirect:
        try:
            return self.payment_service.process_payment_fail(
                data=request.data
            )
        except Exception:
            return HttpResponseRedirect(
                redirect_to=settings.FRONTEND_PAYMENT_FAIL_URL
            )
