from django.shortcuts import get_object_or_404
from rest_framework import serializers

from . import models
from products import serializers as product_serializer
from products import models as product_models


class CartProductReadSerializer(serializers.ModelSerializer):
    """Сериализатор чтения модели объекта корзины."""

    product = product_serializer.ProductSerializer(read_only=True)

    class Meta:
        model = models.OrderProduct
        fields = '__all__'


class CartProductSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    class Meta:
        model = models.OrderProduct
        fields = (
            'amount',
            'product',
        )

    def validate_amount(self, value):
        product_id = self.initial_data['product']
        product = get_object_or_404(product_models.Product, id=product_id)
        if value > product.amount:
            return serializers.ValidationError(
                "Товара слишком мало у поставщика"
            )
        return value


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для модели заказов."""

    order_products = CartProductReadSerializer(many=True, read_only=True)

    class Meta:
        model = models.Order
        fields = '__all__'
