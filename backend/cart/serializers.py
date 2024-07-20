from django.shortcuts import get_object_or_404
from rest_framework import serializers

from . import models
from products import serializers as product_serializers
from products import models as product_models
from product_components import serializers as product_component_serializers


class CartProductCreateSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    class Meta:
        model = models.OrderProduct
        fields = (
            'id',
            'amount',
            'product',
            'color',
            'size'
        )

class CartProductUpdateSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    class Meta:
        model = models.OrderProduct
        fields = (
            'id',
            'amount',
            'color',
            'size'
        )


class CartOrderProductSerializer(serializers.ModelSerializer):
    """Модель объекта корзины."""

    product = product_serializers.OrderProductSerializer(read_only=True)
    color = product_component_serializers.ColorSerializer()
    size = product_component_serializers.SizeSerializer()
    images = product_serializers.ImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = models.OrderProduct
        fields = (
            'id',
            'amount',
            'product',
            'color',
            'size',
            'images'
        )

    def validate_amount(self, value):
        product_id = self.initial_data['product']
        product = get_object_or_404(product_models.Product, id=product_id)
        if value > product.amount:
            return serializers.ValidationError(
                "Товара слишком мало у поставщика"
            )
        return value


class CartCreateSerializer(serializers.ModelSerializer):
    order_products = serializers.PrimaryKeyRelatedField(
        queryset=models.OrderProduct.objects.all(),
        many=True
    )

    class Meta:
        model = models.Order
        fields = [
            'order_products'
        ]

class CartTotalSumSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = [
            'total_sum'
        ]


class CartUpdateSerializer(serializers.ModelSerializer):
    order_products = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Order
        exclude = ('customer',)


class CartSerializer(serializers.ModelSerializer):
    order_products = CartOrderProductSerializer(many=True, read_only=True)

    class Meta:
        model = models.Order
        fields = '__all__'
