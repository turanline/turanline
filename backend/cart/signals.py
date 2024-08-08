from django.db.models.signals import m2m_changed, post_save, pre_save
from django.dispatch import receiver

from . import models


@receiver(post_save, sender=models.OrderProducts)
def update_cart_total_on_orderproduct_save(sender, instance, **kwargs):
    carts = models.Cart.objects.filter(
        order_products=instance
    )
    for cart in carts:
        cart.total_sum = sum(item.sum for item in cart.order_products.all())
        cart.save(update_fields=['total_sum'])


@receiver(m2m_changed, sender=models.Cart.order_products.through)
def update_cart_total_on_orderproduct_m2m_change(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        instance.total_sum = sum(item.sum for item in instance.order_products.all())
        instance.save(update_fields=['total_sum'])
