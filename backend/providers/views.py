import logging

from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, serializers
from products import models as product_models
from products import serializers as product_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers

logger = logging.getLogger(__name__)


@extend_schema(tags=['provider'])
class ProviderViewSet(viewsets.ModelViewSet):
    queryset = models.Provider.objects.all()
    serializer_class = serializers.ProviderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            logger.error(f"Error during ProviderViewSet create: {e}")
            raise e

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
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
        except Exception as e:
            logger.error(f"Error during ProviderViewSet update: {e}")
            raise e

    @action(methods=['GET'], detail=True)
    def products(self, request, *args, **kwargs):
        provider = self.get_object()
        products = product_models.Product.objects.filter(
            provider=provider.user
        )
        serializer = product_serializers.ProductLightSerializer(products, many=True)

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
