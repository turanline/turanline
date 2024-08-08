from django.shortcuts import get_object_or_404
from rest_framework import serializers

from . import models, mixins
from products import serializers as product_serializers
from products import models as product_models
from payment import serializers as payment_serializers
from product_components import serializers as product_component_serializers
from product_components import models as product_component_models


class OrderProductsBaseSerializer(serializers.ModelSerializer):

    sum = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True
    )

    class Meta:
        model = models.OrderProducts
        read_only_fields = [
            'sum'
        ]


class CartBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Cart


class OrderBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Order


class OrderProductsCreateSerializer(OrderProductsBaseSerializer):

    class Meta(OrderProductsBaseSerializer.Meta):
        fields = [
            'id',
            'amount',
            'product',
            'color',
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
            'sum'
        ]


class OrderProductsSerializer(OrderProductsBaseSerializer):

    product = product_serializers.OrderProductSerializer()

    color = product_component_serializers.ColorSerializer()

    images = product_serializers.ImageSerializer(
        many=True
    )

    class Meta(OrderProductsBaseSerializer.Meta):
        fields = [
            'id',
            'amount',
            'product',
            'color',
            'images',
            'sum'
        ]
        read_only_fields = [
            'product',
            'images'
        ]


class CartSerializer(CartBaseSerializer):

    order_products = OrderProductsSerializer(
        many=True
    )

    class Meta(CartBaseSerializer.Meta):
        fields = '__all__'
        read_only_fields = [
            'order_products'
        ]


class OrderSerializer(
    mixins.OrderMixin,
    OrderBaseSerializer
):

    payment = payment_serializers.CardPaymentSerializer()

    class Meta(OrderBaseSerializer.Meta):
        exclude = [
            'customer',
            'status',
            'is_paid'
        ]
        read_only_fields = [
            'total_sum'
        ]
