from rest_framework import serializers

from . import models


class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'


class BrandSerializer(BaseSerializer):
    """Сериализатор для модели брендов продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Brand


class SizeSerializer(BaseSerializer):
    """Сериализатор для модели размеров продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Size


class ColorSerializer(BaseSerializer):
    """Сериализатор для модели цветов продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Color


class ManufactoryCountrySerializer(BaseSerializer):
    """Сериализатор для модели стран производителей продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.ManufacturerCountry


class ProductCategoriesSerializer(BaseSerializer):
    """Сериализатор для модели категорий продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Category


class ProductTypeSerializer(BaseSerializer):
    """Сериализатор для модели типов продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.ProductType


class ProductSubTypeSerializer(BaseSerializer):
    """Сериализатор для модели подкатегорий продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.ProductSubType
