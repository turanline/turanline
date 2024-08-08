import logging

from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

import clients
from . import models, serializers, paginations, permissions
from products import models as product_models
from products import serializers as product_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers
from users import serializers as user_serializers
from cart import models as cart_models
from cart import enums as cart_enums

logger = logging.getLogger(__name__)


@extend_schema(tags=['provider'])
class ProviderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Provider.objects.all()
    pagination_class = paginations.NotificationPaginator
    serializer_class = serializers.ProviderSerializer
    permission_classes = [permissions.IsOwner]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.twilio_client = clients.TwilioClient()
        self.redis_client = clients.RedisClient()

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'products':
            return product_serializers.ProductLightSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action == 'time_left':
            return serializers.ModerationTimeSerializer
        elif self.action == 'status_change_archive':
            return product_serializers.ProductStatusChangeArchiveSerializer
        elif self.action == 'get_orders':
            return serializers.ProviderOrderSerializers
        elif self.action == 'get_last_downloaded_file':
            return user_serializers.ProviderDownloadFileSerializer
        return super().get_serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
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
        verif_code = self.twilio_client.send_verification_code(
            recipient=provider.user.phone_number
        )
        self.redis_client.add(
            f'{provider.user.phone_number}_verif',
            verif_code
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance=instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        provider = serializer.save()
        verif_code = self.twilio_client.send_verification_code(
            recipient=provider.user.phone_number
        )
        self.redis_client.add(
            provider.user.phone_number,
            verif_code
        )
        return Response(
            data=serializer.data,
        )

    @action(methods=['GET'], detail=False)
    def products(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        products = product_models.Product.objects.filter(
            provider=provider.user
        )
        serializer = self.get_serializer(
            instance=products,
            many=True,
            context={'request': request}
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def reviews(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        products = product_models.Product.objects.filter(
            provider=provider.user
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
    def time_left(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        serializer = self.get_serializer(
            instance=provider.user
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=False)
    def status_change_archive(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        archive_qs = product_models.ProductStatusChangeArchive.objects.filter(
            provider=provider.user
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
    def get_orders(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        orders = cart_models.Order.objects.filter(
            order_products__product__provider=provider.user,
            status__in=(
                cart_enums.OrderStatuses.FINISHED,
                cart_enums.OrderStatuses.PROCESSED,
                cart_enums.OrderStatuses.COLLECTED
            )
        ).distinct().prefetch_related(
            Prefetch(
                'order_products',
                queryset=cart_models.OrderProduct.objects.filter(
                    product__provider=provider.user
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
    def get_last_downloaded_file(self, request, *args, **kwargs):
        provider = get_object_or_404(
            models.Provider,
            user=request.user
        )
        serializer = self.get_serializer(
            instance=provider
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
