from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

from . import models, mixins, fields
from mssite import settings
from product_components import serializers as product_components_serializers
from product_components import models as product_components_models


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Image
        exclude = (
            'product',
        )


class ProductSizeSerializer(serializers.ModelSerializer):

    id = serializers.PrimaryKeyRelatedField(
        source='size',
        read_only=True
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
        source='color',
        read_only=True
    )

    slug = serializers.SlugRelatedField(
        source='color',
        slug_field='slug',
        queryset=product_components_models.Color.objects.all()
    )

    color = serializers.SlugRelatedField(
        slug_field='color',
        read_only=True
    )

    class Meta:
        model = models.ProductColor
        fields = [
            'id',
            'slug',
            'color',
            'amount'
        ]


class ProductUpdateSerializer(TranslatableModelSerializer):

    name = serializers.CharField(required=False, trim_whitespace=True)

    description = serializers.CharField(required=False, trim_whitespace=True)

    compound = serializers.CharField(required=False, trim_whitespace=True)

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
        exclude = [
            'color',
            'size',
            'slug',
            'article_number',
            'category',
            'is_famous',
            'provider'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sizes_data'] = ProductSizeSerializer(
            instance.productsize_set.all(),
            many=True
        ).data
        representation['colors_data'] = ProductColorSerializer(
            instance.productcolor_set.all(),
            many=True
        ).data
        return representation

    def update(self, instance, validated_data):
        sizes_data = validated_data.pop('productsize_set', None)
        images_data = validated_data.pop('images', None)
        colors_data = validated_data.pop('productcolor_set', None)

        if sizes_data:
            sizes_list = []
            instance.productsize_set.all().delete()
            for size_data in sizes_data:
                product_size_object = models.ProductSize(
                    product=instance,
                    size=size_data['size'],
                    amount=size_data['amount']
                )
                sizes_list.append(product_size_object)
            models.ProductSize.objects.bulk_create(sizes_list)

        if colors_data:
            colors_list = []
            instance.productcolor_set.all().delete()
            for color_data in colors_data:
                product_color_object = models.ProductColor(
                    product=instance,
                    color=color_data['color'],
                    amount=color_data['amount']
                )
                colors_list.append(product_color_object)
            models.ProductColor.objects.bulk_create(colors_list)

        if images_data:
            images_list = []
            for index, image_data in enumerate(images_data):
                if image_data:
                    instance.images.filter(
                        product=instance,
                        position=index
                    ).delete()
                    image_instance = models.Image(
                        product=instance,
                        image_file=image_data,
                        position=index
                    )
                    images_list.append(image_instance)
            models.Image.objects.bulk_create(images_list)

        for lan_code in settings.PARLER_LANGUAGES[None]:
            translation_instance, created = models.ProductTranslation.objects.get_or_create(
                master=instance,
                language_code=lan_code['code']
            )
            if validated_data.get('name'):
                translation_instance.name = settings.translator.translate(
                    validated_data['name'],
                    dest=lan_code['code']
                ).text
            if validated_data.get('description'):
                translation_instance.description = settings.translator.translate(
                    validated_data['description'],
                    dest=lan_code['code']
                ).text
            if validated_data.get('compound'):
                translation_instance.compound = settings.translator.translate(
                    validated_data['compound'],
                    dest=lan_code['code']
                ).text
            translation_instance.save()

        return super().update(instance, validated_data)


class ProductLightSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""

    translations = TranslatedFieldsField(
        shared_model=models.Product,
        read_only=True
    )

    images = ImageSerializer(many=True)

    class Meta:
        model = models.Product
        fields = '__all__'


class OrderProductSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    """Легкий сериализатор для модели продуктов."""

    translations = TranslatedFieldsField(
        shared_model=models.Product,
        read_only=True
    )

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

    colors_data = ProductColorSerializer(
        source='productcolor_set',
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
        exclude = (
            'size',
            'color'
        )
        lookup_field = 'slug'


class ProductDataArchiveSerializer(
    mixins.TranslatedSerializerMixin,
    TranslatableModelSerializer
):
    translations = TranslatedFieldsField(
        shared_model=models.Product,
        read_only=True
    )

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
