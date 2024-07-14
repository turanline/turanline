from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, filters
from rest_framework.permissions import IsAuthenticated

from . import models, serializers, enums
from customers import models as customer_models


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
        customer = customer_models.Customer.objects.filter(user=request.user).first()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        current_product, created_order = models.OrderProduct.objects.get_or_create(
            **serializer.validated_data
        )
        order, created_cart = models.Order.objects.get_or_create(
            address=customer.address,
            customer=customer,
            total_sum=100
        )
        order.order_products.add(current_product)
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
