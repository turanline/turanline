import hashlib
import logging
import random
import uuid
from typing import Any, Dict

from django.conf import settings
from smsaero import SmsAero, SmsAeroException

from mssite import exceptions

logger = logging.getLogger(__name__)


class SMSAeroClient:

    def __init__(self) -> None:
        self.client = SmsAero(
            settings.SMSAERO_EMAIL,
            settings.SMSAERO_API_KEY
        )

    @property
    def _generate_code(self) -> str:
        return ''.join(str(random.randint(0, 9)) for _ in range(6))

    def _generate_hash_password(self, phone_number: int) -> str:
        unique_string = str(phone_number) + str(uuid.uuid4())
        return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()[:10]

    def _send_message(
        self,
        phone_number: int,
        message: str
    ) -> Dict[str, Any]:
        return self.client.send_sms(
            phone_number,
            message
        )

    def send_verification_code(
        self,
        recipient: int
    ) -> Dict[str, Any]:
        try:
            verif_code = self._generate_code
            return self._send_message(
                phone_number=recipient,
                message=f'Your verification code - {verif_code}'
            )

        except SmsAeroException as error:
            logger.error(f'SMSAero verification code sending error: {error}')
            raise exceptions.SMSAeroUnavailableException

    def send_password(
        self,
        recipient: int
    ) -> Dict[str, Any]:
        try:
            password = self._generate_hash_password(
                phone_number=recipient
            )
            return self._send_message(
                phone_number=recipient,
                message=f'Your new password - {password}'
            )

        except SmsAeroException as error:
            logger.error(f'SMSAero password sending error: {error}')
            raise exceptions.SMSAeroUnavailableException
