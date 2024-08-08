import django_filters

from . import models


class DeliverySearchFilter(django_filters.FilterSet):

    city = django_filters.NumberFilter(
        field_name='city__id',
        lookup_expr='exact'
    )

    tariff = django_filters.NumberFilter(
        field_name='tariff__id',
        lookup_expr='exact'
    )

    category = django_filters.NumberFilter(
        field_name='category__id',
        lookup_expr='exact'
    )

    class Meta:
        model = models.Delivery
        fields = [
            'city',
            'tariff',
            'category'
        ]
