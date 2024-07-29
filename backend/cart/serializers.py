from django.shortcuts import get_object_or_404
from rest_framework import serializers

from . import models
from products import serializers as product_serializers
from products import models as product_models
from product_components import serializers as product_component_serializers
from product_components import models as product_component_models


class OrderProductsBaseSerializer(serializers.ModelSerializer):

    sum = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True,
        read_only=True
    )

    class Meta:
        model = models.OrderProduct


class CartProductsBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order


class OrderProductsCreateSerializer(OrderProductsBaseSerializer):

    class Meta(OrderProductsBaseSerializer.Meta):
        fields = [
            'id',
            'amount',
            'product',
            'color',
            'size',
            'sum'
        ]

    def validate_amount(self, value):
        product = product_models.Product.objects.get(
            id=self.initial_data.get('product')
        )
        color = product_component_models.Color.objects.get(
            id=self.initial_data['color']
        )
        if color in product.color.all():
            product_color = get_object_or_404(
                product_models.ProductColor,
                product=product,
                color=color
            )
            if value < product_color.amount:
                return value
            raise serializers.ValidationError(
                "Товара данного цвета слишком мало у поставщика"
            )
        raise serializers.ValidationError(
            "У товара нет такого цвета"
        )


class OrderProductsUpdateSerializer(OrderProductsBaseSerializer):
    class Meta(OrderProductsBaseSerializer.Meta):
        fields = [
            'id',
            'amount',
            'color',
            'size',
            'sum'
        ]


class OrderProductsSerializer(OrderProductsBaseSerializer):

    product = product_serializers.OrderProductSerializer(
        read_only=True
    )

    color = product_component_serializers.ColorSerializer()

    size = product_component_serializers.SizeSerializer()

    images = product_serializers.ImageSerializer(
        many=True,
        read_only=True
    )

    class Meta(OrderProductsBaseSerializer.Meta):
        fields = [
            'id',
            'amount',
            'product',
            'color',
            'size',
            'images',
            'sum'
        ]


class CartProductsConfirmSerializer(CartProductsBaseSerializer):
    class Meta(CartProductsBaseSerializer.Meta):
        fields = [
            'address',
            'delivery_type',
            'delivery_price'
        ]


# class CartUpdateSerializer(CartProductsBaseSerializer):
#
#     order_products = serializers.PrimaryKeyRelatedField(read_only=True)
#
#     class Meta(CartProductsBaseSerializer.Meta):
#         exclude = (
#             'customer',
#         )


class CartProductsRetrieveSerializer(CartProductsBaseSerializer):

    order_products = OrderProductsSerializer(
        many=True,
        read_only=True
    )

    class Meta(CartProductsBaseSerializer.Meta):
        fields = '__all__'
