"""Модуль описывающий логику """

import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.http import HttpResponse, JsonResponse
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from products.models import Product
from products.serializers import ProductSerializer

from .models import Order, OrderProduct, Review, User
from .permissions import (IsAuthenticatedOrOwnerUserPermission,
                          IsOwnerOrAdminCartProductPermission,
                          IsOwnerOrAdminUserReviewPermission)
from .serializers import (CartProductReadSerializer, CartProductSerializer,
                          CustomerUserLoginSerializer,
                          CustomerUserReadLoginSerializer,
                          LightReviewSerializer, OrderSerializer,
                          ReviewSerializer)
from .services.cart_service import CartService
from .services.reviews_service import ReviewService
from .services.user_service import UserService

logger = logging.getLogger(__name__)


@extend_schema(tags=['jwt auth'])
@extend_schema_view(
    post=extend_schema(
        summary='Get access and refresh token by username and password',
    )
)
class TokenObtainPairViewDoc(TokenObtainPairView):
    pass


@extend_schema(tags=['jwt auth'])
@extend_schema_view(
    post=extend_schema(
        summary='Get new access token by previous access token'
    ),
)
class TokenRefreshViewDoc(TokenRefreshView):
    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(TokenVerifyView):
    @extend_schema(
        summary='Verify access token',
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        token = AccessToken(request.data['token'])
        user_id = token['user_id']
        return Response({'user': user_id}, status=status.HTTP_200_OK)


@extend_schema(tags=['reviews'])
@extend_schema_view(
    list=extend_schema(
        summary='Get all reviews of product endpoint',
        parameters=[
            OpenApiParameter(
                name='product_id',
                description='Reviews filtering by product id',
                type=OpenApiTypes.INT,
                required=True,
                location=OpenApiParameter.QUERY,
            )
        ],
    ),
    create=extend_schema(
        summary="Create user's review endpoint",
    ),
    destroy=extend_schema(
        summary="Destroy user's review endpoint",
    ),
    update=extend_schema(
        summary="Update user's review endpoint",
    ),
    partial_update=extend_schema(
        summary="Partial update user's review endpoint",
    ),
)
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
@extend_schema_view(
    favorites=extend_schema(
        summary='Get current users favorites endpoint',
    ),
    create=extend_schema(
        summary='Create user endpoint',
    ),
    update=extend_schema(
        summary='Update current user endpoint',
    ),
    partial_update=extend_schema(
        summary='Update current user endpoint',
    ),
    retrieve=extend_schema(
        summary='Get users personal data endpoint',
    ),
    orders=extend_schema(
        summary='Get users orders endpoint',
    ),
    reviews=extend_schema(
        summary='Get users reviews endpoint',
    ),
)
class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = CustomerUserLoginSerializer

    def create(self, request, *args, **kwargs):
        user_data = request.data
        response = super().create(request, *args, **kwargs)
        created_user = UserService.get_user_by_username(
            username=user_data['username']
        )
        CartService.create_empty_cart(user=created_user)
        return response

    def get_serializer_class(self):
        if self.action == 'favorites':
            return ProductSerializer
        elif self.action == 'retrieve':
            return CustomerUserReadLoginSerializer
        elif self.action == 'orders':
            return OrderSerializer
        elif self.action == 'reviews':
            return ReviewSerializer
        return super().get_serializer_class()

    def get_permissions(self):
        if self.action in (
            'update',
            'partial_update',
            'favorites',
            'retrieve',
            'orders',
            'reviews',
        ):
            self.permission_classes = [
                IsAdminUser | IsAuthenticatedOrOwnerUserPermission
            ]

        return super().get_permissions()

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
        serializer = self.get_serializer(
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
        serializer = self.get_serializer(user_reviews, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )

    @action(methods=['get'], detail=True)
    def favorites(self, request: User, *args, **kwargs):
        user = self.get_object()
        user_favorites = user.favorites.all()

        serializer = self.get_serializer(
            user_favorites,
            many=True,
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )


@extend_schema(tags=['cart'])
@extend_schema_view(
    create=extend_schema(
        summary='Add product to cart endpoint',
    ),
    destroy=extend_schema(
        summary='Delete product from cart endpoint',
    ),
    list=extend_schema(
        summary='Get cart of current user endpoint',
    ),
    update=extend_schema(
        summary='Update cart product',
    ),
    partial_update=extend_schema(
        summary='Partial update cart product',
    ),
)
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
        current_cart = Order.objects.get(user=request.user, status='CR')
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
                obj_data = CartProductSerializer(obj).data
                return JsonResponse(
                    status=status.HTTP_201_CREATED,
                    data=obj_data,
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
