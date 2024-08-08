import random
import hashlib
import uuid

from django.conf import settings
from twilio.rest import Client


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
        return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()

    def _send_message(self, recipient: str, message: str) -> None:
        self.client.messages.create(
            to=recipient,
            from_=settings.TWILIO_NUMBER,
            body=message
        )

    def send_verification_code(self, recipient: str) -> str:
        verif_code = self._generate_code
        self._send_message(
            recipient=recipient,
            message=verif_code
        )
        return verif_code

    def send_password(self, recipient: str) -> str:
        password = self._generate_hash_password(
            recipient=recipient
        )
        self._send_message(
            recipient=recipient,
            message=password
        )
        return password
