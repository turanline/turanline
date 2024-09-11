from parler_rest.fields import TranslatedFieldsField
from parler_rest.serializers import TranslatableModelSerializer
from rest_framework import serializers

from mssite import mixins

from . import models


class BaseSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'


class ColorSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Color
    )

    class Meta(BaseSerializer.Meta):
        model = models.Color
        read_only_fields = [
            'translations'
        ]


class ManufactorerCountrySerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.ManufacturerCountry
    )

    class Meta(BaseSerializer.Meta):
        model = models.ManufacturerCountry
        read_only_fields = [
            'translations'
        ]


class CategoriesSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Category
    )

    class Meta:
        model = models.Category
        exclude = [
            'lft',
            'rght',
            'tree_id'
        ]
        read_only_fields = [
            'translations'
        ]


class SizeSerializer(BaseSerializer):

    class Meta(BaseSerializer.Meta):
        model = models.Size
