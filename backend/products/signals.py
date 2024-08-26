from typing import Any

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from . import models


@receiver(pre_save, sender=models.Product)
def product_status_change(
    sender: models.Product,
    instance: models.Product,
    **kwargs: Any
) -> None:
    if instance.pk:
        old_product = models.Product.objects.get(pk=instance.pk)
        if old_product.status != instance.status:
            models.ProductStatusChangeArchive.objects.create(
                product=instance,
                old_status=old_product.status,
                new_status=instance.status,
                provider=instance.provider
            )


@receiver(post_save, sender=models.Product)
def generate_article_number_and_slug(
    sender: models.Product,
    instance: models.Product,
    created: bool,
    **kwargs: Any
) -> None:
    if created:
        instance.article_number = f'{instance.provider.user_id:04d}{instance.id:05d}'
        instance.save()

