import logging
from typing import Any, List, Type, Union

from django.db.models.deletion import ProtectedError
from django.db.models.query import QuerySet
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.translation import get_language_from_request
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, parsers, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from customers import models as customer_models
from customers import serializers as customer_serializers
from providers import permissions as provider_permissions

from . import enums
from . import filters as product_filters
from . import models as product_models
from . import serializers, tasks

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
    queryset = product_models.Product.objects.select_related(
        'provider',
        'manufacturerCountry',
        'category'
    ).prefetch_related(
        'color',
        'size'
    )
    serializer_class = serializers.ProductSerializer
    permission_classes = [
        provider_permissions.IsProviderOrReadOnlyPermission
    ]
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend
    ]
    filterset_class = product_filters.CatalogFilter
    lookup_field = 'article_number'
    ordering_fields = ['date_and_time']

    def get_queryset(
        self
    ) -> Union[
        QuerySet,
        List[product_models.Product]
    ]:
        if self.action == 'famous':
            return self.queryset.filter(
                is_famous=True,
                status=enums.ProductStatus.ACTIVE
            )[:3]
        elif self.action == 'similar':
            return self.queryset.filter(
                status=enums.ProductStatus.ACTIVE
            )
        return super().get_queryset()

    def get_serializer_class(self) -> Type[Serializer]:
        if self.action == 'create':
            return serializers.ProductCreateSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action in ('update', 'partial_update'):
            return serializers.ProductUpdateSerializer
        return super().get_serializer_class()

    def perform_create(
        self,
        serializer: serializers.ProductSerializer
    ) -> serializers.ProductSerializer:
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

    @action(methods=['GET'], detail=False)
    def famous(
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
            status=status.HTTP_200_OK,
        )

    @action(methods=['GET'], detail=True)
    def similar(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        obj = self.get_object()
        queryset = self.get_queryset().filter(
            category=obj.category
        ).exclude(
            id=obj.id
        )
        serializer = self.get_serializer(
            instance=queryset,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], detail=True)
    def reviews(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        obj = self.get_object()
        queryset = customer_models.Review.objects.filter(
            product=obj
        )
        serializer = self.get_serializer(
            instance=queryset,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
