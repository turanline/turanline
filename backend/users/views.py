import logging

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
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
    """Класс нужный для визуализации обновления токена в схеме."""

    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(views.TokenVerifyView):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
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

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return serializers.UserReadLoginSerializer
        elif self.action == 'orders':
            return cart_serializers.OrderSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action == 'favorites':
            return product_serializers.ProductSerializer
        else:
            return serializers.UserLoginSerializer

    @action(methods=['get'], detail=False)
    def me(self, request, *args, **kwargs):
        instance = get_object_or_404(models.User, username=request.user.username)
        serializer = serializers.UserLoginSerializer(instance)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(methods=['get'], detail=True)
    def orders(self, request, *args, **kwargs):
        user = self.get_object()
        user_orders = (
            cart_models.Order.objects.filter(
                user=user,
                status__in=(
                    cart_enums.OrderStatuses.PROCESSED,
                    cart_enums.OrderStatuses.COLLECTED,
                    cart_enums.OrderStatuses.FINISHED,
                ),
            )
            .prefetch_related('order_products')
            .order_by('-created_date')
        )
        serializer = cart_serializers.OrderSerializer(
            user_orders,
            many=True,
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )

    @action(methods=['get'], detail=True)
    def reviews(self, request, *args, **kwargs):
        user = self.get_object()
        user_reviews = customer_models.Review.objects.filter(
            user=user
        ).order_by('-created_datetime')
        serializer = customer_serializers.ReviewSerializer(user_reviews, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )


@extend_schema(tags=['news'])
class NewsViewSet(viewsets.ModelViewSet):
    queryset = models.News.objects.all()

    def get_serializer_class(self):
        if self.action in ('create', 'retrieve'):
            return serializers.NewsReadSerializer
        return serializers.NewsWriteSerializer
