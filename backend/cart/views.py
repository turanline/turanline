from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, filters
from rest_framework.permissions import IsAuthenticated

from . import models, serializers, enums


@extend_schema(tags=['cart'])
class CartProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Order.objects.prefetch_related('order_products')
    filter_backends = [filters.SearchFilter]
    search_fields = ['id']
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        current_product, created = models.OrderProduct.objects.get_or_create(
            **serializer.validated_data
        )
        if not created:
            return JsonResponse(
                status=status.HTTP_400_BAD_REQUEST,
                data={'message': 'Product is already in cart'}
            )
        return JsonResponse(
            status=status.HTTP_201_CREATED,
            data=serializer.data
        )

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list':
            self.serializer_class = serializers.CartProductReadSerializer
        elif self.action == 'create':
            self.serializer_class = serializers.CartProductLightSerializer
        else:
            self.serializer_class = serializers.CartProductSerializer
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        if self.action == 'list':
            return models.Order.objects.filter(
                customer__user=self.request.user,
                status=enums.OrderStatuses.CREATED
            )
        return super().get_queryset()
