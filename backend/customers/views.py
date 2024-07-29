from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import QuerySet
from django.http.request import QueryDict
from django.shortcuts import get_object_or_404

from . import serializers, models, permissions
from products import serializers as product_serializers
from cart import enums as cart_enums
from cart import models as cart_models
from cart import serializers as cart_serializers


@extend_schema(tags=['customer'])
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'favorites':
            return product_serializers.ProductSerializer
        elif self.action == 'get_customer_history':
            return cart_serializers.CartProductsRetrieveSerializer
        return super().get_serializer_class(*args, **kwargs)

    @action(methods=['get'], detail=False)
    def favorites(self, request, *args, **kwargs):
        customer = get_object_or_404(models.Customer, user=request.user)
        customer_favorites = customer.favorites.all()
        serializer = self.get_serializer(
            customer_favorites,
            many=True,
            context={'request': request}
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def get_customer_history(self, request, *args, **kwargs):
        customer = get_object_or_404(models.Customer, user=request.user)
        customer_orders = cart_models.Order.objects.filter(
            customer=customer,
            status__in=(
                cart_enums.OrderStatuses.FINISHED,
                cart_enums.OrderStatuses.PROCESSED,
                cart_enums.OrderStatuses.COLLECTED
            )
        )
        serializer = self.get_serializer(
            customer_orders,
            many=True,
            context={'request': request}
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )


@extend_schema(tags=['reviews'])
class ReviewsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Review.objects.select_related('user', 'product')
    permission_classes = [permissions.IsOwnerOrAdminUserReviewPermission]
    serializer_class = serializers.ReviewSerializer

    @staticmethod
    def apply_product_reviews_filter(
        request_data: QueryDict, queryset: QuerySet
    ) -> QuerySet | None:
        product_id = request_data.get('product_id', None)
        if product_id:
            return queryset.filter(product__id=product_id)

    def get_queryset(self):
        request_data = self.request.GET
        filter_result = self.apply_product_reviews_filter(
            request_data,
            self.queryset,
        )
        if filter_result:
            self.queryset = filter_result
            return super().get_queryset()
        return models.Review.objects.none()

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return serializers.LightReviewSerializer
        return super().get_serializer_class()
