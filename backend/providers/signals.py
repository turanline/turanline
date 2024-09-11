from typing import Any

from django.db.models import signals
from django.dispatch import receiver

from payment import models as payment_models

from . import models


@receiver(signals.post_save, sender=models.Provider)
def create_wallet_after_provider_creation(
    sender: models.Provider,
    instance: models.Provider,
    created: bool,
    **kwargs: Any
) -> None:
    if created:
        payment_models.Wallet.objects.create(
            provider=instance
        )

