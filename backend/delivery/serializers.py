from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from . import models
from mssite import mixins
from product_components import serializers as product_components_serializer


class CitySerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(shared_model=models.City)

    class Meta:
        model = models.City
        fields = '__all__'


class TariffSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(shared_model=models.Tariff)

    class Meta:
        model = models.Tariff
        fields = '__all__'


class DeliverySerializer(serializers.ModelSerializer):

    city = CitySerializer()

    tariff = TariffSerializer()

    category = product_components_serializer.ProductCategoriesSerializer(
        many=True
    )

    class Meta:
        model = models.Delivery
        fields = '__all__'
