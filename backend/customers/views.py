from typing import Any, Type

from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework_simplejwt.tokens import RefreshToken

import clients
from cart import enums as cart_enums
from cart import models as cart_models
from cart import serializers as cart_serializers
from products import serializers as product_serializers

from . import models, permissions, serializers


@extend_schema(tags=['customer'])
class CustomerViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    permission_classes = [
        permissions.CreateOrIsCustomerPermission
    ]

    def initial(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> None:
        super().initial(request, *args, **kwargs)
        self.twilio_client = clients.TwilioClient()
        self.redis_client = clients.RedisClient()

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'favorites':
            return product_serializers.ProductSerializer
        elif self.action == 'get_customer_history':
            return cart_serializers.OrderCustomerHistorySerializer
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
        customer = serializer.save()
        headers = self.get_success_headers(serializer.data)
        if customer.user.is_verified:
            refresh = RefreshToken.for_user(customer.user)
            return Response(
                data={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                status=status.HTTP_200_OK
            )
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance=instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def favorites(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        customer_favorites = request.user.customer.favorites.all()
        serializer = self.get_serializer(
            instance=customer_favorites,
            many=True,
            context={
                'request': request
            }
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def get_customer_history(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        customer_orders = cart_models.Order.objects.filter(
            customer=request.user.customer,
            status__in=(
                cart_enums.OrderStatuses.CARGO_TRANSFERRED,
                cart_enums.OrderStatuses.FINISHED,
                cart_enums.OrderStatuses.PROCESSED,
                cart_enums.OrderStatuses.COLLECTED
            ),
            is_paid=True
        )
        serializer = self.get_serializer(
            instance=customer_orders,
            context={
                'request': request
            },
            many=True
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )
