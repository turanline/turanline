import webcolors
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from mssite import settings
from import_export import resources, fields, widgets

from . import models
from products.clients.connector import FileAccess
from product_components import models as product_component_models
from users import models as user_models


class ProductsResource(resources.ModelResource):

    amount = fields.Field(
        column_name='amount',
        attribute='amount',
        widget=widgets.IntegerWidget(coerce_to_string=False)
    )

    provider = fields.Field(
        column_name='provider',
        attribute='provider',
        widget=widgets.ForeignKeyWidget(
            user_models.User,
            field='username'
        )
    )

    manufacturerCountry = fields.Field(
        column_name='manufacturerCountry',
        attribute='manufacturerCountry',
        widget=widgets.ForeignKeyWidget(
            product_component_models.ManufacturerCountry,
            field='name'
        )
    )

    size = fields.Field(
        column_name='size',
        attribute='size',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Size,
            field='name'
        )
    )

    brand = fields.Field(
        column_name='brand',
        attribute='brand',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Brand,
            field='name'
        )
    )

    color = fields.Field(
        column_name='color',
        attribute='color',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Color,
            field='color'
        )
    )

    subTypes = fields.Field(
        column_name='subTypes',
        attribute='subTypes',
        widget=widgets.ManyToManyWidget(
            product_component_models.ProductSubType,
            field='name'
        )
    )

    def before_import_row(self, row, **kwargs):
        obj_color, created = product_component_models.Color.objects.get_or_create(
            name=webcolors.hex_to_name(row['color'].lower()),
            color=row['color'].upper()
        )
        obj_size, created = product_component_models.Color.objects.get_or_create(
            name=row['size'].upper()
        )
        obj_category = get_object_or_404(
            product_component_models.Category,
            name=row['category']
        )
        obj_type = get_object_or_404(
            product_component_models.ProductType,
            name=row['type'],
            category=obj_category
        )

    def after_save_instance(self, instance, row, **kwargs):
        # file_1 = ContentFile(
        #     FileAccess.get_downloaded_file(row['first_image']),
        #     name=f'{instance.name}-first_photo.jpg'
        # )
        # file_2 = ContentFile(
        #     FileAccess.get_downloaded_file(row['second_image']),
        #     name=f'{instance.name}-second_photo.jpg'
        # )
        # file_3 = ContentFile(
        #     FileAccess.get_downloaded_file(row['third_image']),
        #     name=f'{instance.name}-third_photo.jpg'
        # )
        # file_4 = ContentFile(
        #     FileAccess.get_downloaded_file(row['fourth_image']),
        #     name=f'{instance.name}-fourth_photo.jpg'
        # )
        # file_5 = ContentFile(
        #     FileAccess.get_downloaded_file(row['fifth_image']),
        #     name=f'{instance.name}-fifth_photo.jpg'
        # )
        # instance.first_image.save('1.jpg', file_1)
        # instance.second_image.save('2.jpg', file_2)
        # instance.third_image.save('3.jpg', file_3)
        # instance.fourth_image.save('4.jpg', file_4)
        # instance.fifth_image.save('5.jpg', file_5)

        translations = list()
        for lan_code in settings.PARLER_LANGUAGES[None]:
            translation = models.ProductTranslation(
                master=instance,
                name=row['name'],
                description=row['description'],
                compound=row['compound'],
                language_code=lan_code['code']
            )
            translations.append(translation)

        models.ProductTranslation.objects.bulk_create(translations)

    class Meta:
        model = models.Product
        exclude = (
            'first_image',
            'second_image',
            'third_image',
            'fourth_image',
            'fifth_image',
            'is_famous',
            'is_published',
            'status',
            'date_and_time'
        )
        skip_unchanged = False
        use_bulk = False
