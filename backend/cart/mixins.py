from collections import OrderedDict
from decimal import Decimal
from typing import Tuple

from django.core.exceptions import ValidationError
from django.db import models, transaction

from delivery import models as delivery_models

from . import models as cart_models


class OrderMixin:

    def _calculate_delivery(
        self,
        order_products: models.QuerySet,
        delivery_data: OrderedDict
    ) -> Tuple[Decimal, int, int]:
        delivery_price, total_weight, min_days, max_days = 0, 0, 0, 0

        for order_product in order_products:
            category_root = order_product.product.category.get_root()
            delivery = delivery_models.DeliveryVariant.objects.filter(
                category=category_root,
                **delivery_data
            ).first()

            if not delivery:
                raise ValidationError(
                    'No delivery option found for request parameters.'
                )

            total_weight += order_product.product.weight * order_product.amount
            delivery_price += delivery.price
            min_days = max(min_days, delivery.days_min)
            max_days = max(max_days, delivery.days_max)

        delivery_multiplier = Decimal(
            1 if total_weight <= 70
            else (total_weight // 70) + (total_weight % 70 > 0)
        )

        return delivery_price * delivery_multiplier, min_days, max_days

    def _create_order_delivery(
        self,
        delivery_price: Decimal,
        min_days: int,
        max_days: int,
        delivery_data: OrderedDict
    ) -> delivery_models.Delivery:
        return delivery_models.Delivery.objects.create(
            price=delivery_price,
            days_min=min_days,
            days_max=max_days,
            **delivery_data
        )

    @transaction.atomic
    def create(
        self,
        validated_data: OrderedDict
    ) -> cart_models.Order:
        order_products = validated_data.pop('order_products')
        delivery_data = validated_data.pop('delivery')
        order = cart_models.Order.objects.create(**validated_data)

        delivery_price, min_days, max_days = self._calculate_delivery(
            order_products=order_products,
            delivery_data=delivery_data
        )

        order.order_products.add(*order_products)
        order.delivery = self._create_order_delivery(
            delivery_price=delivery_price,
            min_days=min_days,
            max_days=max_days,
            delivery_data=delivery_data
        )
        order.save()
        return order

    @transaction.atomic
    def update(
        self,
        instance: cart_models.Order,
        validated_data: OrderedDict
    ) -> cart_models.Order:
        delivery_data = validated_data.pop('delivery')

        delivery_price, min_days, max_days = self._calculate_delivery(
            order_products=instance.order_products.all(),
            delivery_data=delivery_data
        )

        instance.delivery = self._create_order_delivery(
            delivery_price=delivery_price,
            min_days=min_days,
            max_days=max_days,
            delivery_data=delivery_data
        )
        instance.save()
        return instance
