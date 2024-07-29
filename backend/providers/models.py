from django.db import models

from . import enums
from mssite import storages
from users import models as user_models


class BankAccountNumber(models.Model):

    number = models.CharField(
        null=False,
        blank=False,
        verbose_name='Номер банковского счета'
    )


class Provider(models.Model):

    user = models.OneToOneField(
        user_models.User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    country = models.CharField(
        max_length=20,
        blank=False,
        null=False,
        verbose_name='Страна поставщика'
    )

    phone_number = models.CharField(
        max_length=20,
        unique=False,
        blank=False,
        verbose_name='Номер телефона поставщика'
    )

    company = models.CharField(
        max_length=2048,
        null=False,
        blank=False,
        verbose_name='Название компании'
    )

    address = models.TextField(
        blank=False,
        null=False,
        verbose_name='Адрес'
    )

    taxpayer_identification_number = models.CharField(
        unique=True,
        verbose_name='ИНН или его аналог'
    )

    bank_account_number = models.ForeignKey(
        BankAccountNumber,
        verbose_name='Номера банковских счетов',
        on_delete=models.CASCADE
    )

    state = models.CharField(
        max_length=50,
        choices=enums.ProviderStates,
        default=enums.ProviderStates.MODERATING
    )

    last_downloaded_file = models.FileField(
        upload_to='downloaded_xlsx/',
        storage=storages.OverwriteStorage(),
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f'Поставщик {self.user.username}'
