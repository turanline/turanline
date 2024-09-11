import logging
from typing import Any, List, Type, Union

from django.db import models
from django.db.models.query import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from cart import enums as cart_enums
from cart import filters as cart_filters
from cart import models as cart_models
from cart import serializers as cart_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers
from payment import models as payment_models
from payment import serializers as payment_serializers
from products import filters as product_filters
from products import models as product_models
from products import serializers as product_serializers
from users import serializers as user_serializers
from users import tokens as user_tokens

from . import models as provider_models
from . import paginations, permissions, serializers

logger = logging.getLogger(__name__)


@extend_schema(tags=['provider'])
class ProviderViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = provider_models.Provider.objects.select_related(
        'user',
        'bank_account_number'
    )
    pagination_class = paginations.NotificationPaginator
    serializer_class = serializers.ProviderSerializer
    permission_classes = [
        permissions.CreateOrIsProviderPermission
    ]
    filter_backends = [DjangoFilterBackend]

    def get_object(
        self
    ) -> Union[
        provider_models.Provider,
        payment_models.Wallet
    ]:
        if self.action == 'get_balance':
            return payment_models.Wallet.objects.get(
                provider=self.request.user.provider
            )
        return super().get_object()

    def get_queryset(
        self
    ) -> Union[
        QuerySet,
        List[models.Model]
    ]:
        if self.action == 'get_orders':
            return cart_models.Order.objects.filter(
                order_products__product__provider=self.request.user.provider,
                status__in=(
                    cart_enums.OrderStatuses.FINISHED,
                    cart_enums.OrderStatuses.PROCESSED,
                    cart_enums.OrderStatuses.COLLECTED,
                    cart_enums.OrderStatuses.CARGO_TRANSFERRED
                ),
                is_paid=True
            ).distinct().prefetch_related(
                models.Prefetch(
                    'order_products',
                    queryset=cart_models.OrderProducts.objects.filter(
                        product__provider=self.request.user.provider
                    ),
                    to_attr='filtered_order_products'
                )
            )
        elif self.action == 'products':
            return product_models.Product.objects.filter(
                provider=self.request.user.provider
            )
        elif self.action == 'reviews':
            products = product_models.Product.objects.filter(
                provider=self.request.user.provider
            )
            return customer_models.Review.objects.filter(
                product__id__in=products
            )
        elif self.action == 'status_change_archive':
            return product_models.ProductStatusChangeArchive.objects.filter(
                provider=self.request.user.provider
            )
        return super().get_queryset()

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'get_balance':
            return payment_serializers.WalletSerializer
        elif self.action == 'get_last_downloaded_file':
            return serializers.ProviderDownloadFileSerializer
        elif self.action == 'get_orders':
            return cart_serializers.OrderProviderHistorySerializer
        elif self.action == 'products':
            return product_serializers.ProductSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action == 'status_change_archive':
            return product_serializers.ProductStatusChangeArchiveSerializer
        elif self.action == 'time_left':
            return user_serializers.ModerationTimeSerializer
        return super().get_serializer_class()

    def perform_update(
        self,
        serializer: serializers.ProviderSerializer
    ) -> serializers.ProviderSerializer:
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
        provider = serializer.save()
        headers = self.get_success_headers(serializer.data)
        if provider.user.is_verified:
            refresh = user_tokens.CustomRefreshToken.for_user(provider.user)
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
    def products(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        filterset = product_filters.ProductFilter(
            data=request.query_params,
            queryset=queryset
        )
        if not filterset.is_valid():
            return Response(
                data=filterset.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            instance=filterset.qs,
            many=True,
            context={
                'request': request
            }
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def reviews(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            instance=queryset,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def time_left(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            instance=request.user
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def status_change_archive(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(
                instance=page,
                context={
                    'request': request
                },
                many=True
            )
            return self.get_paginated_response(serializer.data)

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

    @action(methods=['GET'], detail=False)
    def get_orders(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        queryset = self.get_queryset()
        filterset = cart_filters.OrderTimeFilter(
            data=request.query_params,
            queryset=queryset
        )
        if not filterset.is_valid():
            return Response(
                data=filterset.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            instance=filterset.qs,
            context={
                'request': request
            },
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def get_balance(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance=instance
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def get_last_downloaded_file(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            instance=request.user.provider
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
