from typing import Any, Type

from drf_spectacular.utils import extend_schema
from rest_framework import filters, mixins, status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from customers import permissions as customer_permissions

from . import models, permissions, serializers, tasks


@extend_schema(tags=['cart'])
class CartViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Cart.objects.prefetch_related('order_products')
    filter_backends = [filters.SearchFilter]
    search_fields = ['id']
    serializer_class = serializers.CartSerializer
    permission_classes = [
        customer_permissions.IsCustomerPermission,
        permissions.IsOwnerPermission
    ]

    def retrieve(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        instance, created = models.Cart.objects.get_or_create(
            customer=request.user.customer
        )
        serializer = self.get_serializer(
            instance=instance
        )
        if created:
            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED
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
    permission_classes = [
        customer_permissions.IsCustomerPermission
    ]

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action in ('update', 'partial_update'):
            return serializers.OrderProductsUpdateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        return serializer.save(
            customer=self.request.user.customer
        )

    def create(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        cart, created = models.Cart.objects.get_or_create(
            customer=request.user.customer
        )
        order = self.perform_create(serializer)
        cart.order_products.add(order)
        headers = self.get_success_headers(serializer.data)
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


@extend_schema(tags=['order'])
class OrderViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [
        customer_permissions.IsCustomerPermission,
        permissions.IsOwnerPermission
    ]

    def get_serializer_class(self) -> type[Serializer]:
        if self.action == 'create':
            return serializers.OrderCreateSerializer
        elif self.action in ('update', 'partial_update'):
            return serializers.OrderUpdateSerializer
        return super().get_serializer_class()

    def create(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        order = self.perform_create(serializer)
        tasks.delete_order_if_not_payed.apply_async(
            (order.id,),
            countdown=2400
        )
        headers = self.get_success_headers(serializer.data)
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        return serializer.save(
            customer=self.request.user.customer
        )

