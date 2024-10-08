import base64
import uuid
from typing import Optional

from django.core.files.base import ContentFile
from rest_framework import serializers


class Base64FileField(serializers.FileField):

    def to_internal_value(
        self,
        data: str
    ) -> Optional[ContentFile]:
        if isinstance(data, str) and data.startswith('data:application'):
            format, applications_str = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(
                base64.b64decode(applications_str),
                name=f'{uuid.uuid4()}.{ext}'
            )
        return super().to_internal_value(data)
