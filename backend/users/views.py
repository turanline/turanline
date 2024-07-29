import logging

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt import views

from . import models, serializers
from products import serializers as product_serializers
from cart import models as cart_models
from cart import enums as cart_enums
from cart import serializers as cart_serializers
from customers import models as customer_models
from customers import serializers as customer_serializers

logger = logging.getLogger(__name__)


@extend_schema(tags=['jwt auth'])
class TokenObtainPairViewDoc(views.TokenObtainPairView):
    pass


@extend_schema(tags=['jwt auth'])
class TokenRefreshViewDoc(views.TokenRefreshView):

    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(views.TokenVerifyView):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            raise InvalidToken(error.args[0])
        token = AccessToken(request.data['token'])
        user_id = token['user_id']
        return Response({'user': user_id}, status=status.HTTP_200_OK)


@extend_schema(tags=['jwt auth'])
class TokenLogoutViewDoc(views.TokenBlacklistView):
    pass


@extend_schema(tags=['users'])
class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):

    queryset = models.User.objects.all()
    serializer_class = serializers.UserLoginSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return serializers.UserReadLoginSerializer
        elif self.action == 'orders':
            return cart_serializers.CartProductsRetrieveSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        return super().get_serializer_class()

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[permissions.IsAuthenticated]
    )
    def me(self, request, *args, **kwargs):
        serializer = serializers.UserLoginSerializer(request.user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[permissions.IsAuthenticated]
    )
    def orders(self, request, *args, **kwargs):
        customer = get_object_or_404(customer_models.Customer, user=request.user)
        user_orders = (
            cart_models.Order.objects.filter(
                customer=customer,
                status__in=(
                    cart_enums.OrderStatuses.PROCESSED,
                    cart_enums.OrderStatuses.COLLECTED,
                    cart_enums.OrderStatuses.FINISHED,
                ),
            )
            .prefetch_related('order_products')
            .order_by('-created_date')
        )
        serializer = self.get_serializer(
            user_orders,
            context={'request': request},
            many=True
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[permissions.IsAuthenticated]
    )
    def reviews(self, request, *args, **kwargs):
        user_reviews = customer_models.Review.objects.filter(
            user=request.user
        ).order_by('-created_datetime')
        serializer = self.get_serializer(
            user_reviews,
            many=True
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )


@extend_schema(tags=['news'])
class NewsViewSet(viewsets.ModelViewSet):
    queryset = models.News.objects.all()

    def get_serializer_class(self):
        if self.action in ('create', 'retrieve'):
            return serializers.NewsReadSerializer
        return serializers.NewsWriteSerializer
