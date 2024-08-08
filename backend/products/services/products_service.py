from collections import OrderedDict

from mssite import settings

from .. import models


class ProductsService:

    @staticmethod
    def create_size_product_many_relations(
        instance: models.Product,
        sizes_data: dict
    ) -> None:
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

    @staticmethod
    def create_color_product_many_relations(
        instance: models.Product,
        colors_data: dict
    ) -> None:
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

    @staticmethod
    def create_image_product_relations(
        instance: models.Product,
        images_data: dict
    ) -> None:
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

    @staticmethod
    def create_translation_product_relations(
        instance: models.Product,
        validated_data: OrderedDict
    ) -> None:
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
