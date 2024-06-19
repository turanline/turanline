"""Модуль описывающий логику представлений."""

import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction, DatabaseError
from django.db.utils import IntegrityError
from django.http import HttpResponse, JsonResponse
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

from .models import (Order, OrderProduct, Review,
                     User, Provider, Customer, SuperAdminNews)
from .permissions import (IsAuthenticatedOrOwnerUserPermission,
                          IsOwnerOrAdminCartProductPermission,
                          IsOwnerOrAdminUserReviewPermission)
from .serializers import (CartProductReadSerializer, CartProductSerializer,
                          CustomerUserLoginSerializer,
                          CustomerUserReadLoginSerializer,
                          LightReviewSerializer, OrderSerializer,
                          ReviewSerializer, ProviderSerializer,
                          CustomerSerializer, SuperAdminNewsReadSerializer,
                          SuperAdminNewsWriteSerializer)
from .services.reviews_service import ReviewService

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


@extend_schema(tags=['reviews'])
class ReviewsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Review.objects.select_related('user', 'product')
    permission_classes = [IsOwnerOrAdminUserReviewPermission]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        request_data = self.request.GET
        filter_result = ReviewService.apply_product_reviews_filter(
            request_data,
            self.queryset,
        )
        if filter_result:
            self.queryset = filter_result
            return super().get_queryset()
        return Review.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewSerializer
        elif self.action in ('update', 'partial_update'):
            return LightReviewSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return HttpResponse(
                status=status.HTTP_400_BAD_REQUEST,
                content='That review is already created',
            )


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
            return CustomerUserReadLoginSerializer
        elif self.action == 'orders':
            return OrderSerializer
        elif self.action == 'reviews':
            return ReviewSerializer
        elif self.action == 'favorites':
            return ProductSerializer
        else:
            return CustomerUserLoginSerializer

    @action(methods=['get'], detail=False)
    def me(self, request, *args, **kwargs):
        instance = get_object_or_404(User, username=request.user.username)
        serializer = CustomerUserLoginSerializer(instance)
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


@extend_schema(tags=['cart'])
class CartProductsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = OrderProduct.objects.select_related('order', 'product')
    serializer_class = CartProductReadSerializer
    permission_classes = [IsOwnerOrAdminCartProductPermission]

    def create(self, request, *args, **kwargs):
        serializer = CartProductSerializer(data=request.data)

        try:
            current_cart = Order.objects.get(user=request.user, status='CR')
        except Order.DoesNotExist:
            current_cart = Order.objects.create(user=request.user, status='CR')

        try:
            product_id = request.data['product']
            self.queryset.get(order=current_cart, product__pk=product_id)
            return HttpResponse(
                status=status.HTTP_400_BAD_REQUEST,
                content='Product is already in cart',
            )
        except ObjectDoesNotExist:
            if serializer.is_valid(raise_exception=True):
                obj = serializer.create(
                    validated_data=serializer.validated_data,
                    order=current_cart,
                )
                return JsonResponse(
                    status=status.HTTP_201_CREATED,
                    data=CartProductSerializer(obj).data,
                )

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list':
            self.serializer_class = CartProductReadSerializer
        else:
            self.serializer_class = CartProductSerializer
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        if self.action == 'list':
            self.queryset = self.queryset.filter(order__user=self.request.user)
        return super().get_queryset()


@extend_schema(tags=['provider'])
class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            logger.error(f"Error during ProviderViewSet create: {e}")
            raise e

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance,
                data=request.data,
                partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error during ProviderViewSet update: {e}")
            raise e


@extend_schema(tags=['customer'])
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def favorites(self, request, *args, **kwargs):
        user = self.get_object()
        customer = Customer.objects.filter(user=user).first()
        customer_favorites = customer.favorites.all()

        serializer = ProductSerializer(
            customer_favorites,
            many=True,
            context={'request': request},
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )


@extend_schema(tags=['superuser'])
class SuperAdminNewsViewSet(viewsets.ModelViewSet):
    queryset = SuperAdminNews.objects.all()

    def get_serializer_class(self):
        if self.action in ('create', 'retrieve'):
            return SuperAdminNewsReadSerializer
        return SuperAdminNewsWriteSerializer
