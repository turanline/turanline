import django_filters
from . import models

class MyModelFilter(django_filters.FilterSet):
    level = django_filters.NumberFilter(method='filter_by_level', required=False)

    class Meta:
        model = models.Category
        fields = []

    def filter_by_level(self, queryset, name, value):
        return models.Category.objects.filter(level=value)