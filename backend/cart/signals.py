from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from . import models


@receiver(m2m_changed, sender=models.Order.order_products.through)
def update_total_sum(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        instance.total_sum = instance.calculate_total_sum()
        instance.save()


@receiver(post_save, sender=models.OrderProduct)
def update_order_total_sum(sender, instance, **kwargs):
    orders = instance.order_set.all()
    for order in orders:
        order.total_sum = order.calculate_total_sum()
        order.save()
