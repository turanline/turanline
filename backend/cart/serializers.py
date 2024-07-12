from django.shortcuts import get_object_or_404
from rest_framework import serializers

from . import models
from products import serializers as product_serializers
from products import models as product_models
from product_components import serializers as product_component_serializers


class OrderBaseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели заказов."""

    class Meta:
        model = models.Order
        fields = '__all__'


class CartProductLightSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    class Meta:
        model = models.OrderProduct
        fields = (
            'amount',
            'product',
            'color',
            'size'
        )


class CartProductSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    product = product_serializers.OrderProductSerializer(read_only=True)
    color = product_component_serializers.ColorSerializer(read_only=True)
    size = product_component_serializers.SizeSerializer(read_only=True)
    sum = serializers.SerializerMethodField()

    class Meta:
        model = models.OrderProduct
        fields = (
            'amount',
            'product',
            'color',
            'size',
            'sum'
        )

    def get_sum(self, obj):
        return obj.amount * int(obj.product.price)

    def validate_amount(self, value):
        product_id = self.initial_data['product']
        product = get_object_or_404(product_models.Product, id=product_id)
        if value > product.amount:
            return serializers.ValidationError(
                "Товара слишком мало у поставщика"
            )
        return value


class CartProductReadSerializer(OrderBaseSerializer):
    """Сериализатор чтения модели объектов корзины."""

    order_products = CartProductSerializer(many=True, read_only=True)
