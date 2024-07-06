import logging

from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, serializers, paginations
from products import models as product_models
from products import serializers as product_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers
from cart import models as cart_models

logger = logging.getLogger(__name__)


@extend_schema(tags=['provider'])
class ProviderViewSet(viewsets.ModelViewSet):
    queryset = models.Provider.objects.all()
    pagination_class = paginations.NotificationPaginator
    serializer_class = serializers.ProviderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def products(self, request, *args, **kwargs):
        provider = self.get_object()
        products = product_models.Product.objects.filter(
            provider=provider.user
        )
        serializer = product_serializers.ProductLightSerializer(
            products,
            many=True,
            context={'request': request}
        )

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=True)
    def reviews(self, request, *args, **kwargs):
        provider = self.get_object()
        products = product_models.Product.objects.filter(
            provider=provider.user
        )
        reviews = customer_models.Review.objects.filter(
            product__id__in=products
        )
        serializer = customer_serializers.ReviewSerializer(reviews, many=True)

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=True)
    def time_left(self, request, *args, **kwargs):
        provider = self.get_object()
        serializer = serializers.ModerationTimeSerializer(provider.user)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=True)
    def status_change_archive(self, request, *args, **kwargs):
        provider = self.get_object()
        user = provider.user
        archive_qs = product_models.ProductStatusChangeArchive.objects.filter(
            provider=user
        )
        page = self.paginate_queryset(archive_qs)
        if page is not None:
            serializer = product_serializers.ProductStatusChangeArchiveSerializer(
                page,
                context={'request': request},
                many=True
            )
            return self.get_paginated_response(serializer.data)

        serializer = product_serializers.ProductStatusChangeArchiveSerializer(
            archive_qs,
            context={'request': request},
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def get_orders(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
        order_product = cart_models.Order.objects.filter(order_products__product__provider=provider.user)
        serializer = serializers.OrdersSerializers(
            order_product,
            context={'request': request},
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
