import django_filters
from django.db.models import QuerySet

from product_components import models as product_component_models

from . import enums, models


class ProductFilter(django_filters.FilterSet):

    status = django_filters.ChoiceFilter(
        choices=enums.ProductStatus.choices
    )

    class Meta:
        model = models.Product
        fields = [
            'status'
        ]


class CatalogFilter(django_filters.FilterSet):

    price_min = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    price_max = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    color = django_filters.ModelMultipleChoiceFilter(
        queryset=product_component_models.Color.objects.all()
    )

    size = django_filters.ModelMultipleChoiceFilter(
        queryset=product_component_models.Size.objects.all()
    )

    season = django_filters.MultipleChoiceFilter(
        choices=enums.SeasonChoices.choices
    )

    mold = django_filters.MultipleChoiceFilter(
        choices=enums.MoldChoices.choices
    )

    material = django_filters.MultipleChoiceFilter(
        choices=enums.MaterialChoices.choices
    )

    status = django_filters.ChoiceFilter(
        choices=enums.ProductStatus.choices
    )

    category = django_filters.ModelChoiceFilter(
        queryset=product_component_models.Category.objects.all(),
        method='filter_by_category_descendants'
    )

    class Meta(ProductFilter.Meta):
        fields = [
            'price_min',
            'price_max',
            'color',
            'size',
            'season',
            'mold',
            'material',
            'category',
            'status',
            'category'
        ]

    def filter_by_category_descendants(
        self,
        queryset: QuerySet[models.Product],
        name: str,
        value: product_component_models.Category
    ) -> QuerySet[models.Product]:
        if value:
            descendants = value.get_descendants(include_self=True)
            return queryset.filter(category__in=descendants)
        return queryset
