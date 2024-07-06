import os

from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage

from users.models import User
from .enums import ProviderStates


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, *args, **kwargs):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class BankAccountNumber(models.Model):
    """Модель номера банковского счета"""

    number = models.CharField(
        null=False,
        blank=False,
        verbose_name='Номер банковского счета'
    )


class Provider(models.Model):
    """Модель поставщиков."""

    user = models.OneToOneField(
        User,
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
        choices=ProviderStates,
        null=False,
        blank=False,
    )

    last_downloaded_file = models.FileField(
        upload_to='downloaded_xlsx/',
        storage=OverwriteStorage(),
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f'Поставщик {self.user.username}'
