import base64
import uuid

from django.core.files.base import ContentFile
from rest_framework import serializers
from . import serializers as product_serializers


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                format, imgstr = data.split(';base64,')
                ext = format.split('/')[-1]
                data = ContentFile(
                    base64.b64decode(imgstr),
                    name=f'{uuid.uuid4()}.' + ext
                )
            except (ValueError, TypeError):
                self.fail('invalid_image')
        elif isinstance(data, str):
            return None
        return super().to_internal_value(data)

    def to_representation(self, value):
        if value:
            return product_serializers.ImageSerializer(value).data
        return None
