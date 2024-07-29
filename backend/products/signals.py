from django.db.models.signals import pre_save
from django.dispatch import receiver

from . import models


@receiver(pre_save, sender=models.Product)
def product_status_change(sender, instance, **kwargs):
    if instance.pk:
        old_product = models.Product.objects.get(pk=instance.pk)
        if old_product.status != instance.status:
            models.ProductStatusChangeArchive.objects.create(
                product=instance,
                old_status=old_product.status,
                new_status=instance.status,
                provider=instance.provider
            )
