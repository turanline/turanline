import logging

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.save()
        refresh = RefreshToken.for_user(provider.user)
        return Response(
            data={
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            },
            status=status.HTTP_201_CREATED
        )

    @action(methods=['GET'], detail=False)
    def products(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
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

    @action(methods=['GET'], detail=False)
    def reviews(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
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

    @action(methods=['GET'], detail=False)
    def time_left(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
        serializer = serializers.ModerationTimeSerializer(provider.user)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def status_change_archive(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
        archive_qs = product_models.ProductStatusChangeArchive.objects.filter(
            provider=provider.user
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
        order_product = cart_models.Order.objects.filter(
            order_products__product__provider=provider.user
        )
        serializer = serializers.OrdersSerializers(
            order_product,
            context={'request': request},
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(methods=['GET'], detail=False)
    def get_last_downloaded_file(self, request, *args, **kwargs):
        provider = get_object_or_404(models.Provider, user=request.user)
        serializer = serializers.ProviderDownloadFileSerializer(provider)
        return Response(serializer.data, status=status.HTTP_200_OK)
