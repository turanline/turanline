from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

from . import models
from products import mixins as product_mixins


class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'


class BrandSerializer(BaseSerializer):
    """Сериализатор для модели брендов продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Brand


class ColorSerializer(
    product_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор для модели цветов продуктов."""

    translations = TranslatedFieldsField(shared_model=models.Color, read_only=True)

    class Meta(BaseSerializer.Meta):
        model = models.Color


class ManufactoryCountrySerializer(
    product_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор для модели стран производителей продуктов."""

    translations = TranslatedFieldsField(shared_model=models.ManufacturerCountry)

    class Meta(BaseSerializer.Meta):
        model = models.ManufacturerCountry


class ProductCategoriesSerializer(
    product_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор для модели категорий продуктов."""

    translations = TranslatedFieldsField(shared_model=models.Category)

    class Meta:
        model = models.Category
        exclude = (
            'lft',
            'rght',
            'tree_id'
        )


class SizeSerializer(BaseSerializer):
    """Сериализатор для модели размеров продуктов."""

    class Meta(BaseSerializer.Meta):
        model = models.Size
