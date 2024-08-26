import logging
from collections import OrderedDict
from typing import Any, Dict, Optional

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

import clients
from mssite import exceptions
from users import models

logger = logging.getLogger(__name__)


class UserService:

    def __init__(self) -> None:
        self.twilio_client = clients.TwilioClient()
        self.redis_client = clients.RedisClient()
        self.sms_aero_client = clients.SMSAeroClient()

    def _phone_number_str_to_int(
        self,
        phone_number: str
    ) -> int:
        return int(phone_number.replace('+', ''))

    def _extract_str_from_response(
        self,
        data: Dict[str, Any]
    ) -> str:
        return data['text'].split(' - ')[-1]

    def _send_verification_code_by_twilio(
        self,
        phone_number: str
    ) -> Optional[str]:
        try:
            verification_code = self.twilio_client.send_verification_code(
                recipient=phone_number
            )
            return verification_code

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioUnavailableException

    def _send_password_by_twilio(
        self,
        phone_number: str
    ) -> Optional[str]:
        try:
            password = self.twilio_client.send_password(
                recipient=phone_number
            )
            return password

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioUnavailableException

    def _send_verification_code_by_sms_aero(
        self,
        phone_number: int
    ) -> Optional[str]:
        try:
            data = self.sms_aero_client.send_verification_code(
                recipient=phone_number
            )
            verification_code = self._extract_str_from_response(
                data=data
            )
            return verification_code

        except exceptions.SMSAeroUnavailableException:
            raise exceptions.SMSAeroUnavailableException

    def _send_password_by_sms_aero(
        self,
        phone_number: int
    ) -> Optional[str]:
        try:
            data = self.sms_aero_client.send_password(
                recipient=phone_number
            )
            password = self._extract_str_from_response(
                data=data
            )
            return password

        except exceptions.SMSAeroUnavailableException:
            raise exceptions.SMSAeroUnavailableException

    def _store_verification_code_in_storage(
        self,
        phone_number: str,
        verification_code: str,
        purpose: str
    ) -> None:
        self.redis_client.add(
            f'{phone_number}_{purpose}',
            verification_code
        )

    def _get_verification_code_from_storage(
        self,
        user: models.User,
        purpose: str
    ) -> Optional[str]:
        return self.redis_client.receive(
            f'{user.phone_number}_{purpose}'
        )

    def _delete_verification_code_from_storage(
        self,
        user: models.User,
        purpose: str
    ) -> None:
        self.redis_client.delete(
            f'{user.phone_number}_{purpose}'
        )

    def _get_user_by_phone_number(
        self,
        phone_number: str
    ) -> Optional[models.User]:
        try:
            return models.User.objects.get(
                phone_number=phone_number
            )
        except ObjectDoesNotExist as error:
            logger.error(error)
            raise ObjectDoesNotExist

    def _set_user_password(
        self,
        user: models.User,
        password: str
    ) -> None:
        user.set_password(password)
        user.save(
            update_fields=['password']
        )

    def _set_user_is_verified(
        self,
        user: models.User
    ) -> None:
        user.is_verified = True
        user.save(
            update_fields=['is_verified']
        )

    def _generate_token(
        self,
        user: models.User
    ) -> RefreshToken:
        return RefreshToken.for_user(user)

    def _handle_user_parameters_before_send_verif_code(
        self,
        user: models.User,
        purpose: str
    ) -> Optional[Response]:
        if purpose == 'verification' and user.is_verified:
            return Response(
                data={
                    'message': 'User is already verified.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if purpose == 'reset_password' and not user.is_verified:
            return Response(
                data={
                    'message': 'User is not verified for password reset.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return None

    def _send_verification_code(
        self,
        phone_number: str
    ) -> Optional[str]:
        if phone_number.startswith('+7'):
            try:
                verification_code = self._send_verification_code_by_sms_aero(
                    phone_number=self._phone_number_str_to_int(phone_number)
                )
                return verification_code

            except exceptions.SMSAeroUnavailableException:
                raise exceptions.SMSAeroUnavailableException

        try:
            verification_code = self._send_verification_code_by_twilio(
                phone_number=phone_number
            )
            return verification_code

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioUnavailableException

    def _send_password(
        self,
        phone_number: str
    ) -> Optional[str]:
        if phone_number.startswith('+7'):
            try:
                password = self._send_password_by_sms_aero(
                    phone_number=self._phone_number_str_to_int(phone_number)
                    )
                return password

            except exceptions.SMSAeroUnavailableException:
                raise exceptions.SMSAeroUnavailableException

        try:
            password = self._send_password_by_twilio(
                phone_number=phone_number
            )
            return password

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioUnavailableException

    def check_user_and_send_verification_code(
        self,
        data: OrderedDict[str, str]
    ) -> Optional[Response]:
        try:
            user = self._get_user_by_phone_number(
                phone_number=data['phone_number']
            )
            response = self._handle_user_parameters_before_send_verif_code(
                user=user,
                purpose=data['purpose']
            )
            if response:
                return response

            verification_code = self._send_verification_code(
                phone_number=user.phone_number
            )
            self._store_verification_code_in_storage(
                phone_number=user.phone_number,
                verification_code=verification_code,
                purpose=data['purpose']
            )
            return None

        except ObjectDoesNotExist:
            return Response(
                data={
                    'detail': 'User does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioServiceUnavailable

        except exceptions.SMSAeroUnavailableException:
            raise exceptions.SSMAeroServiceUnavailable

    def process_user_verification(
        self,
        data: OrderedDict[str, str]
    ) -> Response:
        try:
            user = self._get_user_by_phone_number(
                phone_number=data['phone_number']
            )
            check_code = self._get_verification_code_from_storage(
                user=user,
                purpose='verification'
            )
            if check_code != data['verification_code']:
                return Response(
                    data={
                        'message': 'Code is invalid or expired.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            self._set_user_is_verified(
                user=user
            )
            self._delete_verification_code_from_storage(
                user=user,
                purpose='verification'
            )
            refresh = self._generate_token(user=user)
            return Response(
                data={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return Response(
                data={
                    'detail': 'User does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

    def process_user_password_reset(
        self,
        data: OrderedDict[str, str]
    ) -> Optional[Response]:
        try:
            user = self._get_user_by_phone_number(
                phone_number=data['phone_number']
            )
            check_code = self._get_verification_code_from_storage(
                user=user,
                purpose='reset_password'
            )
            if check_code != data['verification_code']:
                return Response(
                    data={
                        'message': 'Code is invalid or expired.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            self._delete_verification_code_from_storage(
                user=user,
                purpose='reset_password'
            )
            password = self._send_password(
                phone_number=user.phone_number
            )
            self._set_user_password(
                user=user,
                password=password
            )
            return Response(
                data={
                    'message': 'Password reset completed.'
                },
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return Response(
                data={
                    'detail': 'User does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        except exceptions.TwilioUnavailableException:
            raise exceptions.TwilioServiceUnavailable

        except exceptions.SMSAeroUnavailableException:
            raise exceptions.SSMAeroServiceUnavailable
