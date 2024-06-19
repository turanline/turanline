from rest_framework.serializers import ModelSerializer

from .models import Product
from components.serializers import (BrandSerializer, ColorSerializer,
                                    SizeSerializer,
                                    ManufactoryCountrySerializer,
                                    ProductSubTypeSerializer)


class ProductUpdateSerializer(ModelSerializer):
    """Сериализатор обновления для модели продуктов."""

    class Meta:
        """
        Включены все поля исходной модели, кроме slug.
        Введен поиск по slug.
        """

        model = Product
        lookup_field = 'slug'
        exclude = ('slug',)


class ProductLightSerializer(ModelSerializer):
    """Легкий сериализатор для модели продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Product
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    """Сериализатор для модели продуктов."""

    brand = BrandSerializer()
    color = ColorSerializer()
    size = SizeSerializer()
    manufacturerCountry = ManufactoryCountrySerializer()
    subTypes = ProductSubTypeSerializer(many=True)

    class Meta:
        """Включены все поля исходной модели. Введен поиск по slug."""

        model = Product
        lookup_field = 'slug'
        fields = '__all__'
