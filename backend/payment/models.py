import uuid

from django.db import models

from providers import models as provider_models


class Wallet(models.Model):

    uid = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name='Уникальный идентификатор кошелька'
    )

    provider = models.OneToOneField(
        provider_models.Provider,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Поставщик'
    )

    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Баланс'
    )

    created_datetime = models.DateTimeField(
        auto_now_add=True,
        null=False,
        verbose_name='Дата создания'
    )

    class Meta:
        verbose_name = 'Кошелёк'
        verbose_name_plural = 'Кошельки'
