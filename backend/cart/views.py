from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import models, serializers
from customers import models as customer_models


@extend_schema(tags=['cart'])
class CartViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Cart.objects.prefetch_related('order_products')
    filter_backends = [filters.SearchFilter]
    search_fields = ['id']
    serializer_class = serializers.CartSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        customer = get_object_or_404(
            customer_models.Customer,
            user=request.user
        )
        instance, created = models.Cart.objects.get_or_create(
            customer=customer
        )
        serializer = self.get_serializer(
            instance=instance
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['order-products'])
class OrderProductsViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.OrderProducts.objects.all()
    serializer_class = serializers.OrderProductsCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ('update', 'partial_update'):
            return serializers.OrderProductsUpdateSerializer
        return super().get_serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        customer = get_object_or_404(
            customer_models.Customer,
            user=request.user
        )
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        cart, created = models.Cart.objects.get_or_create(
            customer=customer
        )
        order = serializer.save()
        cart.order_products.add(order)
        headers = self.get_success_headers(serializer.data)
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


@extend_schema(tags=['order'])
class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

