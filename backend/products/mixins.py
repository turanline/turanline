from collections import OrderedDict
from typing import Any, Dict

from django.db import transaction

from mssite import settings

from . import models, serializers


class ProductMixin:

    def _create_size_product_many_relations(
        self,
        instance: models.Product,
        data: dict
    ) -> None:
        sizes_list = []
        instance.sizes.all().delete()
        for size_data in data:
            product_size_object = models.ProductSize(
                product=instance,
                size=size_data['size'],
                amount=size_data['amount']
            )
            sizes_list.append(product_size_object)
        models.ProductSize.objects.bulk_create(sizes_list)

    def _create_color_product_many_relations(
        self,
        instance: models.Product,
        data: dict
    ) -> None:
        colors_list = []
        instance.colors.all().delete()
        for color_data in data:
            product_color_object = models.ProductColor(
                product=instance,
                color=color_data['color'],
                amount=color_data['amount']
            )
            colors_list.append(product_color_object)
        models.ProductColor.objects.bulk_create(colors_list)

    def _create_image_product_relations(
        self,
        instance: models.Product,
        data: dict
    ) -> None:
        images_list = []
        for index, image_data in enumerate(data):
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

    def _create_translation_product_relations(
        self,
        instance: models.Product,
        data: dict
    ) -> None:
        for lan_code in settings.PARLER_LANGUAGES[None]:
            translation_instance, created = models.ProductTranslation.objects.get_or_create(
                master=instance,
                language_code=lan_code['code']
            )
            if data.get('name'):
                translation_instance.name = settings.translator.translate(
                    data['name'],
                    dest=lan_code['code']
                ).text
            if data.get('description'):
                translation_instance.description = settings.translator.translate(
                    data['description'],
                    dest=lan_code['code']
                ).text
            if data.get('compound'):
                translation_instance.compound = settings.translator.translate(
                    data['compound'],
                    dest=lan_code['code']
                ).text
            if data.get('pattern'):
                translation_instance.pattern = settings.translator.translate(
                    data['pattern'],
                    dest=lan_code['code']
                ).text
            translation_instance.save()

    def to_representation(
        self,
        instance: models.Product
    ) -> Dict[str, Any]:
        representation = super().to_representation(instance)
        representation['sizes_data'] = serializers.ProductSizeSerializer(
            instance.sizes.all(),
            many=True
        ).data
        representation['colors_data'] = serializers.ProductColorSerializer(
            instance.colors.all(),
            many=True
        ).data
        return representation

    @transaction.atomic
    def create(
        self,
        validated_data: OrderedDict
    ) -> models.Product:
        sizes_data = validated_data.pop('sizes', None)
        images_data = validated_data.pop('images', None)
        colors_data = validated_data.pop('colors', None)

        instance = models.Product.objects.create(**validated_data)

        if sizes_data:
            self._create_size_product_many_relations(
                instance=instance,
                data=sizes_data
            )
        if colors_data:
            self._create_color_product_many_relations(
                instance=instance,
                data=colors_data
            )
        if images_data:
            self._create_image_product_relations(
                instance=instance,
                data=images_data
            )

        self._create_translation_product_relations(
            instance=instance,
            data=validated_data
        )

        return instance

    @transaction.atomic
    def update(
        self,
        instance: models.Product,
        validated_data: OrderedDict
    ) -> models.Product:
        sizes_data = validated_data.pop('sizes', None)
        images_data = validated_data.pop('images', None)
        colors_data = validated_data.pop('colors', None)

        if sizes_data:
            self._create_size_product_many_relations(
                instance=instance,
                data=sizes_data
            )
        if colors_data:
            self._create_color_product_many_relations(
                instance=instance,
                data=colors_data
            )
        if images_data:
            self._create_image_product_relations(
                instance=instance,
                data=images_data
            )

        self._create_translation_product_relations(
            instance=instance,
            data=validated_data
        )

        return super().update(instance, validated_data)
