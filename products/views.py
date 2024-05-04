from rest_framework import viewsets, mixins
from .serializers import (
    ProductSerializer,
    ProductCategoriesSerializer,
    ProductTypeSerializer,
    ProductSubTypeSerializer,
)
from .models import Product, Category, ProductType, ProductSubType
from .permissions import IsAdminUserOrReadOnly
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .services.products_service import ProductsService
from django.http.response import JsonResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


@extend_schema(tags=["products"])
@extend_schema_view(
    retrieve=extend_schema(
        summary="Get product by its slug endpoint",
    ),
    list=extend_schema(
        summary="Get all products endpoint",
        parameters=[
            OpenApiParameter(
                name="cats",
                description="Products filtering by categories",
                many=True,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="color",
                description="Product filtering by color",
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="size",
                description="Product filtering by size",
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="lbprice",
                description="Product filtering by price low border",
                type=OpenApiTypes.DECIMAL,
            ),
            OpenApiParameter(
                name="hbprice",
                description="Product filtering by price high border",
                type=OpenApiTypes.DECIMAL,
            ),
            OpenApiParameter(
                name="brands",
                description="Product filtering by brands",
                many=True,
                type=OpenApiTypes.STR,
            ),
        ],
    ),
    create=extend_schema(
        summary="Create product endpoint",
    ),
    destroy=extend_schema(
        summary="Destroy product endpoint",
    ),
    update=extend_schema(
        summary="Update product endpoint",
    ),
    partial_update=extend_schema(
        summary="Partial update product endpoint",
    ),
    famous=extend_schema(
        summary="Get famous products endpoint",
    ),
    similar=extend_schema(
        summary="Get similar products endpoint",
    ),
)
class ProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Product.objects.select_related(
        "brand", "color", "manufacturerCountry", "size"
    ).prefetch_related("subTypes")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = "slug"

    @action(methods=["get"], detail=False)
    def famous(self, request, *args, **kwargs):
        famous_queryset = self.queryset.filter(is_famous=True)[:3]
        serializer = self.get_serializer(famous_queryset, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )

    @action(methods=["get"], detail=True)
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


@extend_schema(tags=["categories"])
@extend_schema_view(
    list=extend_schema(
        summary="Get all products categories endpoint",
    ),
    retrieve=extend_schema(
        summary="Get product category with joined types and subtypes",
    ),
    create=extend_schema(
        summary="Create product category endpoint",
    ),
    destroy=extend_schema(
        summary="Delete product category endpoint",
    ),
    update=extend_schema(
        summary="Update product category endpoint",
    ),
    partial_update=extend_schema(
        summary="Partial update product category endpoint",
    ),
)
class ProductCategoriesViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Category.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductCategoriesSerializer

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        queryset = ProductSubType.objects.select_related(
            "type", "type__category"
        ).filter(type__category=category)
        category_relations_data = ProductsService.get_category_relations(queryset)
        response_data = {category.name: category_relations_data}
        return JsonResponse(
            data=response_data,
            safe=False,
            json_dumps_params={"ensure_ascii": False},
        )


@extend_schema(tags=["types"])
@extend_schema_view(
    list=extend_schema(
        summary="Get all products types endpoint",
    ),
    create=extend_schema(
        summary="Create product type endpoint",
    ),
    destroy=extend_schema(
        summary="Delete product type endpoint",
    ),
    update=extend_schema(
        summary="Update product type endpoint",
    ),
    partial_update=extend_schema(
        summary="Partial update product type endpoint",
    ),
)
class ProductTypesViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ProductType.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductTypeSerializer


@extend_schema(tags=["subtypes"])
@extend_schema_view(
    list=extend_schema(
        summary="Get all products subtypes endpoint",
    ),
    create=extend_schema(
        summary="Create product subtype endpoint",
    ),
    destroy=extend_schema(
        summary="Delete product subtype endpoint",
    ),
    update=extend_schema(
        summary="Update product subtype endpoint",
    ),
    partial_update=extend_schema(
        summary="Partial update product subtype endpoint",
    ),
)
class ProductSubTypesViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ProductSubType.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    serializer_class = ProductSubTypeSerializer
