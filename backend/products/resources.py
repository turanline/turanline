from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from mssite import settings
from import_export import resources, fields, widgets

from . import models, enums
from product_components import models as product_component_models
from users import models as user_models


class ExportProductsResource(resources.ModelResource):

    master__amount = fields.Field(
        column_name='master__amount',
        attribute='master__amount',
        widget=widgets.IntegerWidget(coerce_to_string=False)
    )

    master__category = fields.Field(
        column_name='master__category',
        attribute='master__category',
        widget=widgets.ManyToManyWidget(
            product_component_models.Category,
            field='slug',
            separator=', '
        )
    )

    master__color = fields.Field(
        column_name='master__color',
        attribute='master__color',
        widget=widgets.ManyToManyWidget(
            product_component_models.Color,
            field='slug',
            separator=', '
        )
    )

    class Meta:
        model = models.ProductTranslation
        fields = [
            'master__article_number',
            'name',
            'description',
            'master__category',
            'master__amount',
            'master__color',
            'compound',
            'master__weight',
            'master__brand__name',
            'master__season',
            'master__pattern',
            'master__price',
            'master__manufacturerCountry__slug',
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
            field='slug'
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
            field='slug',
            separator=', '
        )
    )

    category = fields.Field(
        column_name='category_subchild',
        attribute='category',
        widget=widgets.ManyToManyWidget(
            product_component_models.Category,
            field='slug',
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
            slug=row['category']
        )
        obj_category_child = get_object_or_404(
            product_component_models.Category,
            slug=row['category_child'],
            parent=obj_category
        )
        obj_category_subchild = get_object_or_404(
            product_component_models.Category,
            slug=row['category_subchild'],
            parent=obj_category_child
        )

    def after_save_instance(self, instance, row, **kwargs):
        translations, images, sizes = [], [], []
        image_list = [
            row['first_image'],
            row['second_image'],
            row['third_image'],
            row['fourth_image'],
            row['fifth_image']
        ]

        for size in enums.SizeRange:
            size_obj = models.ProductSize(
                product=instance,
                size=product_component_models.Size.objects.get(name=size.value),
                amount=row[size.value]
            )
            sizes.append(size_obj)

        for image_url in image_list:
            if image_url:
                image = models.Image(
                    product=instance,
                    image_url=image_url
                )
                images.append(image)

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
        models.Image.objects.bulk_create(images)
        models.ProductSize.objects.bulk_create(sizes)

    class Meta:
        model = models.Product
        exclude = (
            'size',
            'is_famous',
            'is_published',
            'status',
            'date_and_time'
        )
        skip_unchanged = False
        use_bulk = False
