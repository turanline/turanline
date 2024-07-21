from drf_spectacular.utils import extend_schema
from django.http.response import JsonResponse
from rest_framework import mixins, viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from . import models, serializers, filters
from products import permissions as product_permissions
from products.services.products_service import ProductsService


@extend_schema(tags=['categories'])
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Category.objects.filter(level=0)
    serializer_class = serializers.ProductCategoriesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.MyModelFilter


@extend_schema(tags=['country'])
class ManufacturerCountryViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.ManufacturerCountry.objects.all()
    serializer_class = serializers.ManufactoryCountrySerializer
