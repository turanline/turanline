import django_filters
from django.db.models import QuerySet

from product_components import models as product_component_models

from . import enums, models


class ProductFilter(django_filters.FilterSet):
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

    season = django_filters.ChoiceFilter(
        choices=enums.SeasonChoices.choices
    )

    mold = django_filters.ChoiceFilter(
        choices=enums.MoldChoices.choices
    )

    category = django_filters.ModelChoiceFilter(
        queryset=product_component_models.Category.objects.filter(level=0),
        method='filter_by_root_category'
    )

    status = django_filters.ChoiceFilter(
        choices=enums.ProductStatus.choices
    )

    class Meta:
        model = models.Product
        fields = [
            'price_min',
            'price_max',
            'color',
            'size',
            'season',
            'mold',
            'category',
            'status'
        ]

    def filter_by_root_category(
        self,
        queryset: QuerySet[models.Product],
        name: str,
        value: product_component_models.Category
    ) -> QuerySet[models.Product]:
        if value:
            descendants = value.get_descendants()
            return queryset.filter(category__in=descendants)
        return queryset

