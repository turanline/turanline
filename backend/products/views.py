from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product
from customers.models import Review
from customers.serializers import ReviewSerializer

from products.permissions import IsAdminUserOrReadOnly

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
    
    @action(methods=['get'], detail=True)
    def reviews(self, request, *args, **kwargs):
        obj = self.get_object()
        obj_reviews = Review.objects.filter(
            product=obj
        )
        serializer = ReviewSerializer(obj_reviews, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

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
