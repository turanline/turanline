from typing import Any, Type

from django.db.models import signals
from django.dispatch import receiver

from products import enums as product_enums

from . import models


@receiver(signals.post_save, sender=models.OrderProducts)
def update_cart_total_sum_after_change_order_product(
    sender: models.OrderProducts,
    instance: models.OrderProducts,
    **kwargs: Any
) -> None:
    carts = instance.carts.all()
    for cart in carts:
        cart.total_sum = sum(item.sum for item in cart.order_products.all())
        cart.save(update_fields=['total_sum'])


@receiver(signals.pre_delete, sender=models.OrderProducts)
def set_order_product_sum_after_delete_to_cart(
    sender: models.OrderProducts,
    instance: models.OrderProducts,
    **kwargs: Any
) -> None:
    carts = instance.carts.all()
    for cart in carts:
        cart.total_sum -= instance.sum
        cart.save(update_fields=['total_sum'])


@receiver(signals.pre_save, sender=models.OrderProducts)
def set_order_product_sum_after_add_to_cart(
    sender: models.OrderProducts,
    instance: models.OrderProducts,
    **kwargs: Any
) -> None:
    product_sizes = instance.product.sizes.all()
    total_sum = sum(
        product_size.amount * instance.product.price
        for product_size in product_sizes
    )
    instance.sum = total_sum * instance.amount


@receiver(signals.m2m_changed, sender=models.Cart.order_products.through)
def update_cart_total_sum_after_m2m_change(
    sender: models.Cart.order_products.through,
    instance: models.Cart,
    action: str,
    **kwargs: Any
) -> None:
    if action == 'post_add':
        order_products = instance.order_products.all()
        instance.total_sum = sum(
            product.sum
            for product in order_products
        )
        instance.save(update_fields=['total_sum'])


@receiver(signals.post_save, sender=models.Order)
def calculate_order_total_sum_before_payment_success(
    sender: models.Order,
    instance: models.Order,
    **kwargs: Any
) -> None:
    if instance.delivery:
        order_products = instance.order_products.all()
        total_sum = sum(
            product.sum
            for product in order_products
        )
        instance.total_sum = total_sum + instance.delivery.price


@receiver(signals.post_save, sender=models.Order)
def reduce_product_color_amount_after_payment_success(
    sender: models.Order,
    instance: models.Order,
    **kwargs: Any
) -> None:
    if instance.is_paid:
        order_products = instance.order_products.all()
        for order_product in order_products:
            product = order_product.product
            all_colors_empty = True

            for product_color in product.colors.all():
                product_color.amount -= order_product.amount
                product_color.save(update_fields=['amount'])
                if product_color.amount > 0:
                    all_colors_empty = False

            if all_colors_empty:
                product.status = product_enums.ProductStatus.ARCHIVE
                product.save(update_fields=['status'])


@receiver(signals.post_save, sender=models.Order)
def clear_cart_after_payment_success(
    sender: models.Order,
    instance: models.Order,
    **kwargs: Any
) -> None:
    if instance.is_paid:
        cart = models.Cart.objects.get(customer=instance.customer)
        cart.order_products.clear()

