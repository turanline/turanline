from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import QuerySet
from django.http.request import QueryDict
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken

import clients
from . import serializers, models, permissions
from products import serializers as product_serializers
from users import serializers as user_serializers
from cart import enums as cart_enums
from cart import models as cart_models
from cart import serializers as cart_serializers


@extend_schema(tags=['customer'])
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.twilio_client = clients.TwilioClient()
        self.redis_client = clients.RedisClient()

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'favorites':
            return product_serializers.ProductSerializer
        elif self.action == 'get_customer_history':
            return cart_serializers.CartRetrieveSerializer
        return super().get_serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        headers = self.get_success_headers(serializer.data)
        if customer.user.is_verified:
            refresh = RefreshToken.for_user(customer.user)
            return Response(
                data={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                status=status.HTTP_200_OK
            )
        verif_code = self.twilio_client.send_verification_code(
            recipient=customer.user.phone_number
        )
        self.redis_client.add(
            f'{customer.user.phone_number}_verif',
            verif_code
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance=instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        verif_code = self.twilio_client.send_verification_code(
            recipient=customer.user.phone_number
        )
        self.redis_client.add(
            customer.user.phone_number,
            verif_code
        )
        return Response(
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def favorites(self, request, *args, **kwargs):
        customer = get_object_or_404(
            models.Customer,
            user=request.user
        )
        customer_favorites = customer.favorites.all()
        serializer = self.get_serializer(
            instance=customer_favorites,
            many=True,
            context={
                'request': request
            }
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(methods=['GET'], detail=False)
    def get_customer_history(self, request, *args, **kwargs):
        customer = get_object_or_404(
            models.Customer,
            user=request.user
        )
        customer_orders = cart_models.Order.objects.filter(
            customer=customer,
            status__in=(
                cart_enums.OrderStatuses.FINISHED,
                cart_enums.OrderStatuses.PROCESSED,
                cart_enums.OrderStatuses.COLLECTED
            )
        )
        serializer = self.get_serializer(
            instance=customer_orders,
            context={
                'request': request
            },
            many=True
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
