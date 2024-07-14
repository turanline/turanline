import logging

from tablib import Dataset

from django.http import Http404
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.conf import settings
from import_export import exceptions
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, views, parsers, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, enums, resources, serializers, tasks
from . import permissions as product_permissions
from customers import models as customer_models
from customers import serializers as customer_serializers
from providers import models as provider_models

logger = logging.getLogger(__name__)


class ImportExportProductDataView(views.APIView):
    parser_classes = [parsers.MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                raise ValidationError('The required file is missing.')
            provider = get_object_or_404(provider_models.Provider, user=request.user)
            tasks.import_products_task.delay(request.FILES['file'].read(), provider.user.id)
            return Response(
                data={'message': 'The import process has been started.'},
                status=status.HTTP_200_OK
            )
        except ValidationError as error:
            logger.error(error)
            return Response(
                data={'message': 'The required file was not attached.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request, *args, **kwargs):
        provider = get_object_or_404(provider_models.Provider, user=request.user)
        tasks.export_products_task.delay(provider.user.id)
        return Response(
            data={'message': 'Creating file for download.'},
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['products'])
class ProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Product.objects.select_related(
        'brand', 'manufacturerCountry'
    ).prefetch_related('subTypes', 'color', 'size')
    serializer_class = serializers.ProductSerializer
    permission_classes = [
        permissions.IsAdminUser
        | product_permissions.ReadOnly
    ]
    lookup_field = 'slug'
    filter_backends = (filters.OrderingFilter, DjangoFilterBackend)
    filterset_fields = ('status',)
    ordering_fields = ('amount', 'date_and_time')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != enums.ProductStatus.BIN:
            instance.status = enums.ProductStatus.BIN
            instance.save()
            return Response(
                data={
                    'message': 'The item has been moved to the cart.'
                },
                status=status.HTTP_202_ACCEPTED
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['GET'], detail=False)
    def famous(self, request, *args, **kwargs):
        famous_queryset = self.queryset.filter(is_famous=True)[:3]
        serializer = self.get_serializer(famous_queryset, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )

    @action(methods=['GET'], detail=True)
    def similar(self, request, *args, **kwargs):
        obj = self.get_object()
        obj_subtypes = obj.subTypes.all()
        filter_queryset = self.queryset.filter(
            subTypes__in=obj_subtypes
        ).exclude(
            name=obj.name
        ).distinct()
        serializer = self.get_serializer(filter_queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(methods=['GET'], detail=True)
    def reviews(self, request, *args, **kwargs):
        obj = self.get_object()
        obj_reviews = customer_models.Review.objects.filter(
            product=obj
        )
        serializer = customer_serializers.ReviewSerializer(obj_reviews, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )
