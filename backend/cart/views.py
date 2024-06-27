from django.http import HttpResponse, JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from . import models, serializers, permissions


@extend_schema(tags=['cart'])
class CartProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.OrderProduct.objects.select_related('order', 'product')
    serializer_class = serializers.CartProductReadSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['id',]
    permission_classes = [
        IsAuthenticated
        | IsAdminUser
        | permissions.IsOwnerPermission
    ]

    def create(self, request, *args, **kwargs):
        serializer = serializers.CartProductSerializer(data=request.data)

        current_cart = models.Order.objects.get_or_create(
            user=request.user,
            status='CR'
        )

        if self.queryset.filter(
            order=current_cart,
            product__pk=request.data.get('product')
        ).exists():
            return HttpResponse(
                status=status.HTTP_400_BAD_REQUEST,
                content='Product is already in cart',
            )

        if serializer.is_valid(raise_exception=True):
            serializer.save(order=current_cart)
            return JsonResponse(
                status=status.HTTP_201_CREATED,
                data=serializer.data,
            )

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list':
            self.serializer_class = serializers.CartProductReadSerializer
        else:
            self.serializer_class = serializers.CartProductSerializer
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        if self.action == 'list':
            self.queryset = self.queryset.filter(
                order__user=self.request.user
            )
        return super().get_queryset()
