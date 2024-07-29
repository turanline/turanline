from drf_spectacular.utils import extend_schema
from rest_framework import mixins, viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from . import models, serializers, filters


@extend_schema(tags=['categories'])
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Category.objects.filter(level=0)
    serializer_class = serializers.ProductCategoriesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.ProductCategoriesFilter


@extend_schema(tags=['country'])
class ManufacturerCountryViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.ManufacturerCountry.objects.all()
    serializer_class = serializers.ManufactoryCountrySerializer


@extend_schema(tags=['color'])
class ColorViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
