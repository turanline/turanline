import django_filters

from . import models


class OrderTimeFilter(django_filters.FilterSet):

    start_date = django_filters.DateTimeFilter(
        field_name='created_date',
        lookup_expr='gte',
        input_formats=['%Y-%m-%dT%H:%M:%S']
    )

    end_date = django_filters.DateTimeFilter(
        field_name='created_date',
        lookup_expr='lte',
        input_formats=['%Y-%m-%dT%H:%M:%S']
    )

    class Meta:
        model = models.Order
        fields = [
            'start_date',
            'end_date'
        ]
