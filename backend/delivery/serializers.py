from parler_rest import serializers as parler_serializers
from rest_framework import serializers

from mssite import mixins

from . import models


class CitySerializer(
    mixins.TranslatedSerializerMixin,
    parler_serializers.TranslatableModelSerializer
):

    translations = parler_serializers.TranslatedFieldsField(
        shared_model=models.City
    )

    class Meta:
        model = models.City
        fields = '__all__'


class TariffSerializer(
    mixins.TranslatedSerializerMixin,
    parler_serializers.TranslatableModelSerializer
):

    translations = parler_serializers.TranslatedFieldsField(
        shared_model=models.Tariff
    )

    class Meta:
        model = models.Tariff
        fields = '__all__'


class DeliverySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Delivery
        fields = '__all__'
        read_only_fields = [
            'price',
            'days_min',
            'days_max'
        ]
