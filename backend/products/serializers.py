from django.shortcuts import get_object_or_404
from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

from . import models, mixins
from mssite import settings
from product_components import serializers as product_components_serializers
from product_components import models as product_components_models


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        exclude = (
            'id',
            'product'
        )


class ProductSizeSerializer(serializers.ModelSerializer):

    size = serializers.SlugRelatedField(
        slug_field='name',
        queryset=product_components_models.Size.objects.all()
    )

    class Meta:
        model = models.ProductSize
        exclude = (
            'id',
            'product'
        )


class ProductUpdateSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор обновления для модели продуктов."""

    name = serializers.CharField(required=False, trim_whitespace=True)

    description = serializers.CharField(required=False, trim_whitespace=True)

    compound = serializers.CharField(required=False, trim_whitespace=True)

    brand = serializers.SlugRelatedField(
        slug_field='name',
        queryset=product_components_models.Brand.objects.all(),
        required=False
    )

    color = serializers.SlugRelatedField(
        slug_field='slug',
        many=True,
        queryset=product_components_models.Color.objects.all(),
        required=False
    )

    sizes_data = ProductSizeSerializer(
        many=True,
        required=False
    )

    manufacturerCountry = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=product_components_models.ManufacturerCountry.objects.all(),
        required=False
    )

    class Meta:
        model = models.Product
        lookup_field = 'slug'
        exclude = (
            'size',
            'slug',
            'article_number',
            'category',
            'is_famous',
            'status',
            'provider'
        )

    def update(self, instance, validated_data):
        sizes_data = validated_data.get('sizes_data')
        if sizes_data:
            for size_data in sizes_data:
                obj = models.ProductSize.objects.get(
                    product=instance,
                    size=size_data['size'],
                )
                obj.amount = size_data['amount']
                obj.save()

        for lan_code in settings.PARLER_LANGUAGES[None]:
            obj = models.ProductTranslation.objects.get(
                master=instance,
                language_code=lan_code['code']
            )
            if validated_data.get('name'):
                obj.name = settings.translator.translate(
                    validated_data['name'],
                    dest=lan_code['code']
                ).text
            if validated_data.get('description'):
                obj.description = settings.translator.translate(
                    validated_data['description'],
                    dest=lan_code['code']
                ).text
            if validated_data.get('compound'):
                obj.compound = settings.translator.translate(
                    validated_data['compound'],
                    dest=lan_code['code']
                ).text

        return super().update(instance, validated_data)


class ProductLightSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""

    translations = TranslatedFieldsField(shared_model=models.Product)
    images = ImageSerializer(many=True)

    class Meta:
        model = models.Product
        fields = '__all__'


class OrderProductSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""
    translations = TranslatedFieldsField(shared_model=models.Product)
    images = ImageSerializer(many=True)

    class Meta:
        model = models.Product
        fields = [
            'id',
            'translations',
            'images',
            'slug',
            'price'
        ]


class ProductSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Сериализатор для модели продуктов."""

    translations = TranslatedFieldsField(
        shared_model=models.Product,
        read_only=True
    )
    brand = product_components_serializers.BrandSerializer(
        read_only=True
    )
    color = product_components_serializers.ColorSerializer(
        many=True,
        read_only=True
    )
    sizes_data = ProductSizeSerializer(
        source='productsize_set',
        many=True,
        read_only=True
    )
    manufacturerCountry = product_components_serializers.ManufactoryCountrySerializer(
        read_only=True
    )
    category = product_components_serializers.ProductCategoriesSerializer(
        many=True,
        read_only=True
    )
    images = ImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = models.Product
        exclude = ('size',)
        lookup_field = 'slug'


class ProductDataArchiveSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    translations = TranslatedFieldsField(shared_model=models.Product)

    class Meta:
        model = models.Product
        fields = [
            'translations',
            'slug'
        ]


class ProductStatusChangeArchiveSerializer(serializers.ModelSerializer):
    product = ProductDataArchiveSerializer()

    class Meta:
        model = models.ProductStatusChangeArchive
        fields = '__all__'
