import logging
from typing import Any, Type

from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework_simplejwt.tokens import RefreshToken

from cart import enums as cart_enums
from cart import models as cart_models
from cart import serializers as cart_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers
from products import models as product_models
from products import serializers as product_serializers
from users import serializers as user_serializers

from . import models, paginations, permissions, serializers

logger = logging.getLogger(__name__)


@extend_schema(tags=['provider'])
class ProviderViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Provider.objects.all()
    pagination_class = paginations.NotificationPaginator
    serializer_class = serializers.ProviderSerializer
    permission_classes = [
        permissions.CreateOrIsProviderPermission
    ]

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'products':
            return product_serializers.ProductSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action == 'time_left':
            return user_serializers.ModerationTimeSerializer
        elif self.action == 'status_change_archive':
            return product_serializers.ProductStatusChangeArchiveSerializer
        elif self.action == 'get_orders':
            return cart_serializers.OrderProviderHistorySerializer
        elif self.action == 'get_last_downloaded_file':
            return serializers.ProviderDownloadFileSerializer
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
        provider = serializer.save()
        headers = self.get_success_headers(serializer.data)
        if provider.user.is_verified:
            refresh = RefreshToken.for_user(provider.user)
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

    @action(methods=['GET'], detail=False)
    def products(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        products = product_models.Product.objects.filter(
            provider=request.user.provider
        )
        serializer = self.get_serializer(
            instance=products,
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
        products = product_models.Product.objects.filter(
            provider=request.user.provider
        )
        reviews = customer_models.Review.objects.filter(
            product__id__in=products
        )
        serializer = self.get_serializer(
            instance=reviews,
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
        archive_qs = product_models.ProductStatusChangeArchive.objects.filter(
            provider=request.user.provider
        )
        page = self.paginate_queryset(archive_qs)
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
            instance=archive_qs,
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
        orders = cart_models.Order.objects.filter(
            order_products__product__provider=request.user.provider,
            status__in=(
                cart_enums.OrderStatuses.FINISHED,
                cart_enums.OrderStatuses.PROCESSED,
                cart_enums.OrderStatuses.COLLECTED
            ),
            is_paid=True
        ).distinct().prefetch_related(
            Prefetch(
                'order_products',
                queryset=cart_models.OrderProducts.objects.filter(
                    product__provider=request.user.provider
                ),
                to_attr='filtered_order_products'
            )
        )
        serializer = self.get_serializer(
            instance=orders,
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
