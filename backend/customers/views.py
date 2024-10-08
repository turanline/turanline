from typing import Any, List, Type, Union

from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

import clients
from cart import enums as cart_enums
from cart import models as cart_models
from cart import serializers as cart_serializers
from products import models as product_models
from products import serializers as product_serializers
from users import tokens as user_tokens

from . import models as customer_models
from . import permissions, serializers


@extend_schema(tags=['customer'])
class CustomerViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = customer_models.Customer.objects.select_related(
        'user'
    ).prefetch_related(
        'favorites'
    )
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

    def get_queryset(
        self
    ) -> Union[
        QuerySet,
        List[models.Model]
    ]:
        if self.action == 'favorites':
            return self.request.user.customer.favorites.all()
        elif self.action == 'get_customer_history':
            return cart_models.Order.objects.filter(
                customer=self.request.user.customer
            ).exclude(
                status=cart_enums.OrderStatuses.CREATED
            )
        return super().get_queryset()

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'favorites':
            return product_serializers.ProductSerializer
        elif self.action == 'get_customer_history':
            return cart_serializers.OrderCustomerHistorySerializer
        elif self.action in (
            'add_to_favorites',
            'remove_from_favorites'
        ):
            return Serializer
        return super().get_serializer_class()

    def perform_update(
        self,
        serializer: serializers.CustomerSerializer
    ) -> serializers.CustomerSerializer:
        return serializer.save()

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
            refresh = user_tokens.CustomRefreshToken.for_user(customer.user)
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
        instance = self.perform_update(serializer)
        if not instance.user.is_verified:
            return Response(
                data=serializer.data,
                status=status.HTTP_406_NOT_ACCEPTABLE
            )
        return Response(
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def favorites(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            instance=queryset,
            context={
                'request': request
            },
            many=True
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(
        methods=['POST'],
        detail=False,
        url_path='favorites/add-favorites/(?P<product_id>[^/.]+)'
    )
    def add_to_favorites(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        product_id = kwargs.get('product_id')
        product = get_object_or_404(
            product_models.Product,
            id=product_id
        )
        customer = request.user.customer

        if product in customer.favorites.all():
            return Response(
                data={
                    'detail': 'Product is already in favorites.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        customer.favorites.add(product)
        return Response(
            data={
                'detail': 'Product added to favorites.'
            },
            status=status.HTTP_201_CREATED
        )

    @action(
        methods=['DELETE'],
        detail=False,
        url_path='favorites/remove-favorites/(?P<product_id>[^/.]+)'
    )
    def remove_from_favorites(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        product_id = kwargs.get('product_id')
        product = get_object_or_404(
            product_models.Product,
            id=product_id
        )
        customer = request.user.customer

        if product not in customer.favorites.all():
            return Response(
                data={
                    'detail': 'Product is not in favorites.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        customer.favorites.remove(product)
        return Response(
            data={
                'detail': 'Product removed from favorites.'
            },
            status=status.HTTP_204_NO_CONTENT
        )

    @action(methods=['GET'], detail=False)
    def get_customer_history(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            instance=queryset,
            context={
                'request': request
            },
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
