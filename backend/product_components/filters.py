import django_filters
from django.db.models.query import QuerySet

from . import models


class CategoriesFilter(django_filters.FilterSet):

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

    def filter_children(
        self,
        queryset: QuerySet[models.Category],
        name: str,
        value: models.Category
    ) -> QuerySet[models.Category]:
        return queryset.filter(
            parent=value
        )

