from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from . import models, serializers, enums
from customers import models as customer_models


@extend_schema(tags=['cart'])
class CartProductsViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Order.objects.prefetch_related('order_products')
    serializer_class = serializers.CartCreateSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['id']
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        customer = customer_models.Customer.objects.filter(user=request.user).first()
        instance, created = models.Order.objects.get_or_create(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        customer = customer_models.Customer.objects.filter(user=request.user).first()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, created_cart = models.Order.objects.get_or_create(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        cart.order_products.add(*serializer.validated_data['order_products'])
        return JsonResponse(
            status=status.HTTP_201_CREATED,
            data=serializer.data
        )

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'retrieve':
            return serializers.CartSerializer
        elif self.action == 'confirm_order':
            return serializers.CartTotalSumSerializer
        return super().get_serializer_class(*args, **kwargs)

    @action(methods=['POST'], detail=False)
    def confirm_order(self, request, *args, **kwargs):
        customer = customer_models.Customer.objects.filter(user=request.user).first()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = models.Order.objects.get(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        order.status = enums.OrderStatuses.COLLECTED
        order.total_sum=serializer.validated_data['total_sum']
        order.save()
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['order'])
class OrderProductsViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.OrderProduct.objects.all()
    serializer_class = serializers.CartProductCreateSerializer

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ('update', 'partial_update'):
            return serializers.CartProductUpdateSerializer
        return super().get_serializer_class(*args, **kwargs)