from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets

from .models import Order, OrderProduct
from .serializers import CartProductReadSerializer, CartProductSerializer
from .permissions import IsOwnerOrAdminCartProductPermission


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
