import logging
from collections import Counter, OrderedDict
from typing import Any

from django.shortcuts import get_object_or_404
from import_export import fields, resources, widgets

from mssite import settings
from product_components import models as product_component_models
from providers import models as provider_models

from . import models

logger = logging.getLogger(__name__)


class ExportProductsResource(resources.ModelResource):

    category = fields.Field(
        column_name='master__category',
        attribute='master__category',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Category,
            field='slug'
        )
    )

    color = fields.Field(
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
            'category',
            'color',
            'compound',
            'pattern',
            'master__mold',
            'master__weight',
            'master__season',
            'master__price',
            'master__manufacturerCountry__slug',
            'master__provider__user__username'
        ]


class ProductsResource(resources.ModelResource):

    provider = fields.Field(
        column_name='provider',
        attribute='provider',
        widget=widgets.ForeignKeyWidget(
            provider_models.Provider,
            field='user_id'
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

    category = fields.Field(
        column_name='category_subchild',
        attribute='category',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Category,
            field='slug'
        )
    )

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.provider_id = kwargs['provider_id']

    def before_import_row(
        self,
        row: OrderedDict,
        **kwargs: Any
    ) -> None:
        logger.error(type(row))
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

    def after_save_instance(
        self,
        instance: models.Product,
        row: OrderedDict,
        **kwargs: Any
    ) -> None:
        translations, sizes, colors = [], [], []
        size_counts = Counter(row['sizes'].split(', '))
        color_list = row['color'].split(', ')

        for size, count in size_counts.items():
            size_obj = get_object_or_404(
                product_component_models.Size.objects,
                name=size
            )
            product_size_obj = models.ProductSize(
                product=instance,
                size=size_obj,
                amount=int(count)
            )
            sizes.append(product_size_obj)

        for item in color_list:
            color_name, count = item.split('-')
            color_obj = get_object_or_404(
                product_component_models.Color.objects,
                slug=color_name
            )
            product_color_obj = models.ProductColor(
                product=instance,
                color=color_obj,
                amount=int(count)
            )
            colors.append(product_color_obj)

        for lan_code in settings.PARLER_LANGUAGES[None]:
            translation = models.ProductTranslation(
                master=instance,
                name=settings.translator.translate(row['name'], dest=lan_code['code']).text,
                description=settings.translator.translate(row['description'], dest=lan_code['code']).text,
                compound=settings.translator.translate(row['compound'], dest=lan_code['code']).text,
                pattern=settings.translator.translate(row['pattern'], dest=lan_code['code']).text,
                language_code=lan_code['code']
            )
            translations.append(translation)

        models.ProductTranslation.objects.bulk_create(translations)
        models.ProductSize.objects.bulk_create(sizes)
        models.ProductColor.objects.bulk_create(colors)

    class Meta:
        model = models.Product
        exclude = (
            'color',
            'size',
            'is_famous',
            'is_published',
            'status',
            'date_and_time'
        )
        skip_unchanged = False
        use_bulk = False
