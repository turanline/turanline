"""Модуль описывающий логику представлений."""

import logging

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import (TokenBlacklistView,
                                            TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)


from products.serializers import ProductSerializer

from .models import User, News
from cart.models import Order
from customers.models import Review
from .serializers import (UserLoginSerializer,
                          UserReadLoginSerializer,
                          NewsReadSerializer,
                          NewsWriteSerializer)
from cart.serializers import OrderSerializer
from customers.serializers import ReviewSerializer

logger = logging.getLogger(__name__)


@extend_schema(tags=['jwt auth'])
class TokenObtainPairViewDoc(TokenObtainPairView):
    pass


@extend_schema(tags=['jwt auth'])
class TokenRefreshViewDoc(TokenRefreshView):
    """Класс нужный для визуализации обновления токена в схеме."""

    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(TokenVerifyView):

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
class TokenLogoutViewDoc(TokenBlacklistView):
    pass


@extend_schema(tags=['users'])
class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):

    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return UserReadLoginSerializer
        elif self.action == 'orders':
            return OrderSerializer
        elif self.action == 'reviews':
            return ReviewSerializer
        elif self.action == 'favorites':
            return ProductSerializer
        else:
            return UserLoginSerializer

    @action(methods=['get'], detail=False)
    def me(self, request, *args, **kwargs):
        instance = get_object_or_404(User, username=request.user.username)
        serializer = UserLoginSerializer(instance)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(methods=['get'], detail=True)
    def orders(self, request, *args, **kwargs):
        user = self.get_object()
        user_orders = (
            Order.objects.filter(
                user=user,
                status__in=(
                    Order.PROCESSED,
                    Order.COLLECTED,
                    Order.FINISHED,
                ),
            )
            .prefetch_related('order_products')
            .order_by('-created_date')
        )
        serializer = OrderSerializer(
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
        user_reviews = Review.objects.filter(
            user=user
        ).order_by('-created_datetime')
        serializer = ReviewSerializer(user_reviews, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )


@extend_schema(tags=['news'])
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()

    def get_serializer_class(self):
        if self.action in ('create', 'retrieve'):
            return NewsReadSerializer
        return NewsWriteSerializer
