from rest_framework import serializers

from . import models
from product_components import serializers as product_components_serializers


class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = '__all__'


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор обновления для модели продуктов."""

    class Meta:
        model = models.Product
        lookup_field = 'slug'
        exclude = ('slug',)


class ProductLightSerializer(BaseSerializer):
    """Легкий сериализатор для модели продуктов."""
    pass


class ProductSerializer(BaseSerializer):
    """Сериализатор для модели продуктов."""

    image = product_components_serializers.ImagesSerializer(many=True)
    brand = product_components_serializers.BrandSerializer()
    color = product_components_serializers.ColorSerializer()
    size = product_components_serializers.SizeSerializer()
    manufacturerCountry = product_components_serializers.ManufactoryCountrySerializer()
    subTypes = product_components_serializers.ProductSubTypeSerializer(many=True)

    class Meta(BaseSerializer.Meta):
        lookup_field = 'slug'
