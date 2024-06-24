from django.db import models

from users.models import User


class BankAccountNumber(models.Model):
    """Модель номера банковского счета"""

    number = models.CharField(
        'Номер банковского счета',
        null=False,
        blank=False,
    )


class Provider(models.Model):
    """Модель поставщиков."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    country = models.CharField(
        'Страна поставщика',
        max_length=20,
        blank=False,
        null=False
    )

    phone_number = models.CharField(
        'Номер телефона поставшика',
        max_length=20,
        unique=False,
        blank=False,
    )

    company = models.CharField(
        'Название компании',
        max_length=2048,
        null=False,
        blank=False,
    )

    address = models.TextField(
        'Адрес',
        blank=False,
        null=False,
    )

    #   частные лица
    #   10 символов / 11

    taxpayer_identification_number = models.CharField(
        'ИНН или его аналог',
        unique=True
    )

    bank_account_number = models.ForeignKey(
        BankAccountNumber,
        verbose_name='Номера банковских счетов',
        on_delete=models.CASCADE
    )

    PROVIDER_STATES = [
        ('M', 'Moderating'),
        ('B', 'Blocked'),
        ('F', 'Finished'),
        ('C', 'Canceled')
    ]

    state = models.CharField(
        max_length=50,
        choices=PROVIDER_STATES,
        null=False,
        blank=False,
    )

    def __str__(self) -> str:
        return f'Поставщик {self.user.username}'
