from drf_spectacular.utils import extend_schema
from django.http.response import JsonResponse
from rest_framework import mixins, viewsets, permissions

from . import models, serializers
from products import permissions as product_permissions
from products.services.products_service import ProductsService


@extend_schema(tags=['categories'])
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Category.objects.all()
    permission_classes = [
        permissions.IsAdminUser
        | product_permissions.ReadOnly
    ]
    serializer_class = serializers.ProductCategoriesSerializer

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        queryset = models.ProductSubType.objects.select_related(
            'type', 'type__category'
        ).filter(type__category=category)
        category_relations_data = ProductsService.get_category_relations(
            queryset
        )
        response_data = {category.name: category_relations_data}
        return JsonResponse(
            data=response_data,
            safe=False,
            json_dumps_params={'ensure_ascii': False},
        )


@extend_schema(tags=['categories'])
class ProductTypesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.ProductType.objects.all()
    permission_classes = [
        permissions.IsAdminUser
        | product_permissions.ReadOnly
    ]
    serializer_class = serializers.ProductTypeSerializer


@extend_schema(tags=['categories'])
class ProductSubTypesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.ProductSubType.objects.all()
    permission_classes = [
        permissions.IsAdminUser
        | product_permissions.ReadOnly
    ]
    serializer_class = serializers.ProductSubTypeSerializer


@extend_schema(tags=['country'])
class ManufacturerCountryViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.ManufacturerCountry.objects.all()
    permission_classes = [
        permissions.IsAdminUser
        | product_permissions.ReadOnly
    ]
    serializer_class = serializers.ManufactoryCountrySerializer
