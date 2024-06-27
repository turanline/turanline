import pandas as pd
from tablib import Dataset

from django.forms import model_to_dict

from django.core.files.base import ContentFile
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.conf import settings
from import_export import exceptions
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, views, parsers, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, enums, resources, serializers
from . import permissions as product_permissions
from customers import models as customer_models
from customers import serializers as customer_serializers
from providers import models as provider_models


class ImportProductDataView(views.APIView):
    parser_classes = [parsers.MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            df = pd.read_excel(request.FILES['file'])
            df.rename(columns=enums.rename_columns, inplace=True)
            product_resource = resources.ProductsResource()
            dataset = Dataset().load(df)
            result = product_resource.import_data(
                dataset,
                dry_run=True,
                raise_errors=True
            )
            if result.has_errors():
                raise exceptions.ImportError
            else:
                product_resource.import_data(
                    dataset,
                    dry_run=False
                )
                return Response(
                    data={'message': 'Successfully.'},
                    status=status.HTTP_200_OK
                )
        except exceptions.ImportError:
            return Response(
                data={
                    'message': ('Make sure the data you have filled in is correct, '
                                'table template has not been changed'
                                'And you did not add the same products.')
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request, *args, **kwargs):
        provider = get_object_or_404(provider_models.Provider, user=request.user)
        queryset = models.Product.objects.filter(provider=provider.user)
        dataset = resources.ProductsResource().export(queryset)
        dataset.headers = enums.rename_columns.keys()
        content_file = ContentFile(dataset.export('xlsx'), name=f'{provider.company}_products.xlsx')
        provider.last_downloaded_file.save(f'{provider.company}_products.xlsx', content_file)
        return Response(
            data={
                'file': f'https://{settings.ALLOWED_HOSTS[0]}/media/downloaded_xlsx/{provider.company}_products.xlsx'
            },
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
        'brand', 'color', 'manufacturerCountry', 'size', 'image'
    ).prefetch_related('subTypes')
    serializer_class = serializers.ProductSerializer
    permission_classes = [
        permissions.IsAdminUser |
        product_permissions.ReadOnly
    ]
    lookup_field = 'slug'
    filter_backends = (filters.OrderingFilter, DjangoFilterBackend)
    filterset_fields = ('status',)
    ordering_fields = ('amount', 'date_and_time')

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
        filter_queryset = (
            self.queryset.filter(subTypes__in=obj_subtypes)
            .distinct()
            .exclude(name=obj.name)
        )
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
