import hashlib
import logging
import random
import uuid

from django.conf import settings
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from mssite import exceptions

logger = logging.getLogger(__name__)


class TwilioClient:

    def __init__(self) -> None:
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

    @property
    def _generate_code(self) -> str:
        return ''.join(str(random.randint(0, 9)) for _ in range(6))

    def _generate_hash_password(self, recipient: str) -> str:
        unique_string = recipient + str(uuid.uuid4())
        return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()[:10]

    def _send_message(self, recipient: str, message: str) -> None:
        self.client.messages.create(
            to=recipient,
            from_=settings.TWILIO_NUMBER,
            body=message
        )

    def send_verification_code(self, recipient: str) -> str:
        try:
            verif_code = self._generate_code
            self._send_message(
                recipient=recipient,
                message=f'Your verification code - {verif_code}'
            )
            return verif_code

        except TwilioRestException as error:
            logger.error(f'Twilio verification code sending error: {error}')
            raise exceptions.TwilioUnavailableException

    def send_password(self, recipient: str) -> str:
        try:
            password = self._generate_hash_password(
                recipient=recipient
            )
            self._send_message(
                recipient=recipient,
                message=f'Your new password - {password}'
            )
            return password

        except TwilioRestException as error:
            logger.error(f'Twilio password sending error: {error}')
            raise exceptions.TwilioUnavailableException
