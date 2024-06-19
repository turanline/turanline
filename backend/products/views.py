from django.http.response import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from components.models import (Category, ManufacturerCountry,
                               ProductSubType, ProductType)
from .models import Product

from .permissions import IsAdminUserOrReadOnly
from components.serializers import (ManufactoryCountrySerializer,
                                    ProductSubTypeSerializer,
                                    ProductCategoriesSerializer,
                                    ProductTypeSerializer)
from .serializers import ProductSerializer
from .services.products_service import ProductsService


@extend_schema(tags=['products'])
class ProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Product.objects.select_related(
        'brand', 'color', 'manufacturerCountry', 'size'
    ).prefetch_related('subTypes')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'slug'

    @action(methods=['get'], detail=False)
    def famous(self, request, *args, **kwargs):
        famous_queryset = self.queryset.filter(is_famous=True)[:3]
        serializer = self.get_serializer(famous_queryset, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )

    @action(methods=['get'], detail=True)
    def similar(self, request, *args, **kwargs):
        obj = self.get_object()
        obj_subtypes = obj.subTypes.all()
        filter_queryset = (
            self.queryset.filter(subTypes__in=obj_subtypes)
            .distinct()
            .exclude(name=obj.name)
        )
        serializer = self.get_serializer(filter_queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def get_queryset(self):
        request_data = self.request.GET
        self.queryset = ProductsService.apply_categories_filter(
            request_data,
            self.queryset,
        )
        self.queryset = ProductsService.apply_color_filter(
            request_data,
            self.queryset,
        )
        self.queryset = ProductsService.apply_size_filter(
            request_data,
            self.queryset,
        )
        self.queryset = ProductsService.apply_price_filter(
            request_data,
            self.queryset,
        )
        self.queryset = ProductsService.apply_brands_filter(
            request_data,
            self.queryset,
        )
        return super().get_queryset()


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
