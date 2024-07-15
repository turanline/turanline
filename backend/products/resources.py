from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from mssite import settings
from import_export import resources, fields, widgets

from . import models
from product_components import models as product_component_models
from users import models as user_models


class ExportProductsResource(resources.ModelResource):
    master__amount = fields.Field(
        column_name='master__amount',
        attribute='master__amount',
        widget=widgets.IntegerWidget(coerce_to_string=False)
    )

    master__subTypes = fields.Field(
        column_name='master__subTypes',
        attribute='master__subTypes',
        widget=widgets.ManyToManyWidget(
            product_component_models.ProductSubType,
            field='name',
            separator=', '
        )
    )

    master__size = fields.Field(
        column_name='master__size',
        attribute='master__size',
        widget=widgets.ManyToManyWidget(
            product_component_models.Size,
            field='name',
            separator=', '
        )
    )

    master__color = fields.Field(
        column_name='master__color',
        attribute='master__color',
        widget=widgets.ManyToManyWidget(
            product_component_models.Color,
            field='color',
            separator=', '
        )
    )

    class Meta:
        model = models.ProductTranslation
        fields = [
            'master__article_number',
            'name',
            'description',
            'master__subTypes',
            'master__size',
            'master__amount',
            'master__color',
            'compound',
            'master__brand__name',
            'master__season',
            'master__pattern',
            'master__manufacturerCountry__name',
            'master__price',
            'master__provider__username'
        ]


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
            field='pk'
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
        widget=widgets.ManyToManyWidget(
            product_component_models.Size,
            field='name',
            separator=', '
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
        widget=widgets.ManyToManyWidget(
            product_component_models.Color,
            field='color',
            separator=', '
        )
    )

    subTypes = fields.Field(
        column_name='subTypes',
        attribute='subTypes',
        widget=widgets.ManyToManyWidget(
            product_component_models.ProductSubType,
            field='name',
            separator=', '
        )
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_id = kwargs['provider_id']

    def before_import_row(self, row, **kwargs):
        row['provider'] = self.provider_id

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
        translations, images = [], []
        images_list = [
            row['first_image'],
            row['second_image'],
            row['third_image'],
            row['fourth_image'],
            row['fifth_image']
        ]
        for image_url in images_list:
            if image_url:
                image = models.Image(
                    product=instance,
                    image_url=image_url
                )
                images.append(image)

        models.Image.objects.bulk_create(images)

        for lan_code in settings.PARLER_LANGUAGES[None]:
            translation = models.ProductTranslation(
                master=instance,
                name=settings.translator.translate(row['name'], dest=lan_code['code']).text,
                description=settings.translator.translate(row['description'], dest=lan_code['code']).text,
                compound=settings.translator.translate(row['compound'], dest=lan_code['code']).text,
                language_code=lan_code['code']
            )
            translations.append(translation)

        models.ProductTranslation.objects.bulk_create(translations)

    class Meta:
        model = models.Product
        exclude = (
            'is_famous',
            'is_published',
            'status',
            'date_and_time'
        )
        skip_unchanged = False
        use_bulk = False
