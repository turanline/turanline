from datetime import datetime

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
    viewsets.GenericViewSet,
):
    queryset = models.Order.objects.prefetch_related('order_products')
    filter_backends = [filters.SearchFilter]
    search_fields = ['id']
    serializer_class = serializers.CartProductsRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'retrieve':
            return serializers.CartProductsRetrieveSerializer
        elif self.action == 'confirm_order':
            return serializers.CartProductsConfirmSerializer
        return super().get_serializer_class(*args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        customer = get_object_or_404(customer_models.Customer, user=request.user)
        instance, created = models.Order.objects.get_or_create(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        serializer = self.get_serializer(instance)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['POST'], detail=False)
    def confirm_order(self, request, *args, **kwargs):
        customer = get_object_or_404(
            customer_models.Customer,
            user=request.user
        )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = models.Order.objects.get(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        cart.status = enums.OrderStatuses.COLLECTED
        for attr, value in serializer.validated_data.items():
            setattr(cart, attr, value)
        cart.save()
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
    serializer_class = serializers.OrderProductsCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ('update', 'partial_update'):
            return serializers.OrderProductsUpdateSerializer
        return super().get_serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        customer = get_object_or_404(customer_models.Customer, user=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, created = models.Order.objects.get_or_create(
            customer=customer,
            status=enums.OrderStatuses.CREATED
        )
        order = serializer.save()
        cart.order_products.add(order)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
