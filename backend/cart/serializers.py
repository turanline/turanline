from typing import Optional

from django.shortcuts import get_object_or_404
from rest_framework import serializers

from customers import serializers as customer_serializers
from delivery import serializers as delivery_serializer
from product_components import models as product_component_models
from product_components import serializers as product_component_serializers
from products import models as product_models
from products import serializers as product_serializers

from . import mixins, models


class OrderProductsBaseSerializer(serializers.ModelSerializer):

    sum = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True,
        read_only=True
    )

    class Meta:
        model = models.OrderProducts


class CartBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Cart


class OrderBaseSerializer(
    serializers.ModelSerializer
):

    delivery = delivery_serializer.DeliverySerializer()

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

    def validate_amount(self, value: int) -> Optional[int]:
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
            if value <= product_color.amount:
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

    product = product_serializers.ProductOrderSerializer()

    color = product_component_serializers.ColorSerializer()

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
            'images',
            'sum'
        ]
        read_only_fields = [
            'product'
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


class OrderSerializer(OrderBaseSerializer):

    order_products = OrderProductsSerializer(
        many=True
    )

    class Meta(OrderBaseSerializer.Meta):
        fields = '__all__'


class OrderCreateSerializer(
    mixins.OrderMixin,
    OrderBaseSerializer
):

    class Meta(OrderBaseSerializer.Meta):
        exclude = [
            'payment',
            'created_date',
            'customer',
            'status',
            'is_paid'
        ]
        read_only_fields = [
            'total_sum'
        ]


class OrderUpdateSerializer(
    mixins.OrderMixin,
    OrderBaseSerializer
):

    class Meta(OrderBaseSerializer.Meta):
        exclude = [
            'payment',
            'order_products',
            'created_date',
            'customer',
            'status',
            'is_paid'
        ]
        read_only_fields = [
            'total_sum'
        ]


class OrderCustomerHistorySerializer(OrderBaseSerializer):

    order_products = OrderProductsSerializer(
        many=True,
        read_only=True
    )

    class Meta(OrderBaseSerializer.Meta):
        fields = '__all__'


class OrderProviderHistorySerializer(serializers.ModelSerializer):

    order_products = OrderProductsSerializer(
        many=True,
        source='filtered_order_products'
    )

    customer = customer_serializers.CustomerReadSerializer()

    sum_for_period = serializers.SerializerMethodField()

    class Meta:
        model = models.Order
        exclude = [
            'delivery',
            'payment',
            'total_sum',
            'is_paid'
        ]
        read_only_fields = [
            'customer',
            'order_products'
        ]

    def get_sum_for_period(self, obj: models.Order) -> str:
        return str(
            sum(
                order_product.sum for order_product
                in obj.order_products.all()
            )
        )
