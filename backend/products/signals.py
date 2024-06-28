from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Product, ProductStatusChangeArchive


@receiver(pre_save, sender=Product)
def product_status_change(sender, instance, **kwargs):
    if instance.pk:
        old_product = Product.objects.get(pk=instance.pk)
        if old_product.status != instance.status:
            ProductStatusChangeArchive.objects.create(
                product=instance,
                old_status=old_product.status,
                new_status=instance.status,
                provider=instance.provider
            )