from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

from . import models, mixins
from product_components import serializers as product_components_serializers


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор обновления для модели продуктов."""

    class Meta:
        model = models.Product
        lookup_field = 'slug'
        exclude = ('slug',)


class ProductLightSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""
    translations = TranslatedFieldsField(shared_model=models.Product)

    class Meta:
        model = models.Product
        fields = '__all__'


class OrderProductSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""
    translations = TranslatedFieldsField(shared_model=models.Product)

    class Meta:
        model = models.Product
        fields = ('id', 'translations', 'first_image', 'slug', 'price')


class ProductSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор для модели продуктов."""

    translations = TranslatedFieldsField(shared_model=models.Product)
    brand = product_components_serializers.BrandSerializer()
    color = product_components_serializers.ColorSerializer(many=True)
    size = product_components_serializers.SizeSerializer(many=True)
    manufacturerCountry = product_components_serializers.ManufactoryCountrySerializer()
    subTypes = product_components_serializers.ProductSubTypeSerializer(many=True)

    class Meta:
        model = models.Product
        fields = '__all__'
        lookup_field = 'slug'


class ProductDataArchiveSerializer(mixins.TranslatedSerializerMixin, TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=models.Product)

    class Meta:
        model = models.Product
        fields = ('translations', 'slug')


class ProductStatusChangeArchiveSerializer(serializers.ModelSerializer):
    product = ProductDataArchiveSerializer()

    class Meta:
        model = models.ProductStatusChangeArchive
        fields = '__all__'
