from django.db import models

from mssite import storages
from users import models as user_models

from . import enums


class BankAccountNumber(models.Model):

    number = models.CharField(
        max_length=34,
        blank=False,
        null=False,
        verbose_name='Номер банковского счета'
    )

    class Meta:
        verbose_name = 'Номер банковского счета'
        verbose_name_plural = 'Номера банковских счетов'

    def __str__(self) -> str:
        return f'Банковский счет: ****{self.number[-4:]}'


class Provider(models.Model):

    user = models.OneToOneField(
        user_models.User,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name='Пользователь'
    )

    country = models.CharField(
        max_length=20,
        blank=False,
        null=False,
        verbose_name='Страна поставщика'
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
        max_length=20,
        verbose_name='ИНН или его аналог'
    )

    bank_account_number = models.OneToOneField(
        BankAccountNumber,
        on_delete=models.PROTECT,
        verbose_name='Номер банковского счета'
    )

    state = models.CharField(
        max_length=50,
        choices=enums.ProviderStates,
        default=enums.ProviderStates.MODERATING,
        verbose_name='Состояние'
    )

    last_downloaded_file = models.FileField(
        upload_to='downloaded_xlsx/',
        storage=storages.OverwriteStorage(),
        null=True,
        blank=True,
        verbose_name='Последний загруженный файл'
    )

    class Meta:
        verbose_name = 'Поставщик'
        verbose_name_plural = 'Поставщики'

    def __str__(self) -> str:
        return f'Поставщик {self.user.phone_number}'
