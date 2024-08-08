import django_filters

from . import models


class ProductCategoriesFilter(django_filters.FilterSet):

    level = django_filters.NumberFilter(
        field_name='level',
        lookup_expr='exact',
        required=False
    )

    children = django_filters.ModelChoiceFilter(
        queryset=models.Category.objects.all(),
        method='filter_children',
        label='Children of category'
    )

    class Meta:
        model = models.Category
        fields = [
            'level',
            'children'
        ]

    def filter_children(self, queryset, name, value):
        return queryset.filter(
            parent=value
        )
