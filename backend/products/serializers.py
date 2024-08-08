from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

from . import models, fields, services, mixins
from mssite import mixins as ms_mixins
from product_components import serializers as product_components_serializers
from product_components import models as product_components_models


class ProductSizeSerializer(serializers.ModelSerializer):

    id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='size'
    )

    name = serializers.SlugRelatedField(
        source='size',
        slug_field='name',
        queryset=product_components_models.Size.objects.all()
    )

    class Meta:
        model = models.ProductSize
        fields = [
            'id',
            'name',
            'amount'
        ]


class ProductColorSerializer(serializers.ModelSerializer):

    id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='color'
    )

    slug = serializers.SlugRelatedField(
        source='color',
        slug_field='slug',
        queryset=product_components_models.Color.objects.all()
    )

    color = serializers.SlugRelatedField(
        read_only=True,
        slug_field='color'
    )

    class Meta:
        model = models.ProductColor
        fields = [
            'id',
            'slug',
            'color',
            'amount'
        ]


class ProductBaseSerializer(TranslatableModelSerializer):

    name = serializers.CharField(
        required=False,
        trim_whitespace=True
    )

    description = serializers.CharField(
        required=False,
        trim_whitespace=True
    )

    compound = serializers.CharField(
        required=False,
        trim_whitespace=True
    )

    brand = serializers.SlugRelatedField(
        slug_field='name',
        queryset=product_components_models.Brand.objects.all()
    )

    colors_data = ProductColorSerializer(
        source='productcolor_set',
        many=True
    )

    sizes_data = ProductSizeSerializer(
        source='productsize_set',
        many=True
    )

    manufacturerCountry = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=product_components_models.ManufacturerCountry.objects.all()
    )

    images = serializers.ListSerializer(
        child=fields.Base64ImageField()
    )

    class Meta:
        model = models.Product
        lookup_field = 'slug'


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        exclude = [
            'product'
        ]


class ProductCreateSerializer(
    mixins.ProductCreateMixin,
    ProductBaseSerializer
):

    class Meta(ProductBaseSerializer.Meta):
        exclude = [
            'color',
            'size',
            'slug',
            'article_number',
            'is_famous',
            'provider'
        ]


class ProductUpdateSerializer(
    mixins.ProductUpdateMixin,
    ProductBaseSerializer
):

    class Meta(ProductBaseSerializer.Meta):
        exclude = [
            'color',
            'size',
            'slug',
            'article_number',
            'category',
            'is_famous',
            'provider'
        ]


class ProductLightSerializer(
    ms_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Product
    )

    images = ImageSerializer(
        many=True
    )

    class Meta:
        model = models.Product
        fields = '__all__'
        read_only_fields = [
            'translations'
        ]


class OrderProductSerializer(
    ms_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Product
    )

    images = ImageSerializer(
        many=True
    )

    class Meta:
        model = models.Product
        fields = [
            'id',
            'translations',
            'images',
            'slug',
            'price'
        ]
        read_only_fields = [
            'translations'
        ]


class ProductSerializer(
    ms_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Product
    )

    brand = product_components_serializers.BrandSerializer()

    colors_data = ProductColorSerializer(
        source='productcolor_set',
        many=True
    )

    sizes_data = ProductSizeSerializer(
        source='productsize_set',
        many=True
    )

    manufacturerCountry = product_components_serializers.ManufactoryCountrySerializer()

    category = product_components_serializers.ProductCategoriesSerializer(
        many=True
    )

    images = ImageSerializer(
        many=True
    )

    class Meta:
        model = models.Product
        exclude = [
            'size',
            'color'
        ]
        lookup_field = 'slug'


class ProductDataArchiveSerializer(
    ms_mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):

    translations = TranslatedFieldsField(
        shared_model=models.Product
    )

    class Meta:
        model = models.Product
        fields = [
            'translations',
            'slug'
        ]
        read_only_fields = [
            'translations'
        ]


class ProductStatusChangeArchiveSerializer(
    serializers.ModelSerializer
):

    product = ProductDataArchiveSerializer()

    class Meta:
        model = models.ProductStatusChangeArchive
        fields = '__all__'
