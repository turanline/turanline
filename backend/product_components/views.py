from drf_spectacular.utils import extend_schema
from django.http.response import JsonResponse
from rest_framework import mixins, viewsets

from .models import (Category, ManufacturerCountry,
                     ProductSubType, ProductType)
from products.permissions import IsAdminUserOrReadOnly
from .serializers import (ManufactoryCountrySerializer,
                          ProductSubTypeSerializer,
                          ProductCategoriesSerializer,
                          ProductTypeSerializer)
from products.services.products_service import ProductsService


@extend_schema(tags=['categories'])
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Category.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductCategoriesSerializer

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        queryset = ProductSubType.objects.select_related(
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
    queryset = ProductType.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductTypeSerializer


@extend_schema(tags=['categories'])
class ProductSubTypesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ProductSubType.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductSubTypeSerializer


@extend_schema(tags=['country'])
class ManufacturerCountryViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = ManufacturerCountry.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ManufactoryCountrySerializer
