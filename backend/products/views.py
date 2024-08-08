import logging

from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, views, parsers, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, enums, serializers, tasks
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
            provider = get_object_or_404(
                provider_models.Provider,
                user=request.user
            )
            tasks.import_products_task.delay(
                request.FILES['file'].read(),
                provider.user.id
            )
            return Response(
                data={
                    'message': 'The import process has been started.'
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as error:
            logger.error(error)
            return Response(
                data={
                    'message': 'The required file was not attached.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request, *args, **kwargs):
        provider = get_object_or_404(
            provider_models.Provider,
            user=request.user
        )
        tasks.export_products_task.delay(provider.user.id)
        return Response(
            data={
                'message': 'Creating file for download.'
            },
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['products'])
class ProductsViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.select_related(
        'brand', 'manufacturerCountry'
    ).prefetch_related('category', 'color', 'size')
    serializer_class = serializers.ProductSerializer
    lookup_field = 'slug'
    filter_backends = (
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ['status']
    ordering_fields = ['date_and_time']

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'create':
            return serializers.ProductCreateSerializer
        elif self.action in ('update', 'partial_update'):
            return serializers.ProductUpdateSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        return super().get_serializer_class(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(
            provider=self.request.user
        )

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
        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    @action(methods=['GET'], detail=False)
    def famous(self, request, *args, **kwargs):
        famous_queryset = self.queryset.filter(
            is_famous=True
        )[:3]
        serializer = self.get_serializer(
            instance=famous_queryset,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
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
        serializer = self.get_serializer(
            instance=filter_queryset,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=True)
    def reviews(self, request, *args, **kwargs):
        obj = self.get_object()
        obj_reviews = customer_models.Review.objects.filter(
            product=obj
        )
        serializer = self.get_serializer(
            instance=obj_reviews,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
