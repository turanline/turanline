from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, permissions, viewsets

from . import filters, models, serializers


@extend_schema(tags=['categories'])
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategoriesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.CategoriesFilter


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


@extend_schema(tags=['size'])
class SizeViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Size.objects.all()
    serializer_class = serializers.SizeSerializer
