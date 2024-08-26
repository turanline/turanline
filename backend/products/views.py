import logging
from typing import Any, Type

from django.core.exceptions import ValidationError
from django.db.models.deletion import ProtectedError
from django.utils.translation import get_language_from_request
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, mixins, parsers, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from django.utils.datastructures import MultiValueDictKeyError

from customers import models as customer_models
from customers import serializers as customer_serializers
from providers import permissions as provider_permissions

from . import filters as product_filters
from . import models, serializers, tasks

logger = logging.getLogger(__name__)


class ImportExportProductDataView(views.APIView):
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [
        provider_permissions.IsProviderPermission
    ]

    def post(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        try:
            tasks.import_products_task.delay(
                request.FILES['file'].read(),
                request.user.id
            )
            return Response(
                data={
                    'message': 'The import process has been started.'
                },
                status=status.HTTP_200_OK
            )
        except MultiValueDictKeyError as error:
            logger.error(error)
            return Response(
                data={
                    'message': 'The required file was not attached.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        language_code = get_language_from_request(request)
        tasks.export_products_task.delay(
            provider_id=request.user.id,
            language_code=language_code
        )
        return Response(
            data={
                'message': 'Creating file for download.'
            },
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['products'])
class ProductsViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.select_related(
        'manufacturerCountry'
    ).prefetch_related(
        'category',
        'color',
        'size'
    )
    serializer_class = serializers.ProductSerializer
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend
    ]
    permission_classes = [
        provider_permissions.IsProviderOrReadOnlyPermission
    ]
    filterset_class = product_filters.ProductFilter
    lookup_field = 'article_number'
    filterset_fields = ['status']
    ordering_fields = ['date_and_time']

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'create':
            return serializers.ProductCreateSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action in ('update', 'partial_update'):
            return serializers.ProductUpdateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        return serializer.save(
            provider=self.request.user.provider
        )

    def destroy(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                status=status.HTTP_204_NO_CONTENT
            )
        except ProtectedError:
            return Response(
                    data={
                        'detail': 'Product cannot be removed because it is linked to other objects.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[
            provider_permissions.IsProviderOrReadOnlyPermission
        ]
    )
    def famous(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
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

    @action(
        methods=['GET'],
        detail=True,
        permission_classes=[
            provider_permissions.IsProviderOrReadOnlyPermission
        ]
    )
    def similar(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
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

    @action(
        methods=['GET'],
        detail=True,
        permission_classes=[
            provider_permissions.IsProviderOrReadOnlyPermission
        ]
    )
    def reviews(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
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
