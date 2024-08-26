from django.db import models
from mptt import models as mptt_models
from parler.models import TranslatableModel, TranslatedFields

from product_components import models as product_component_models


class City(TranslatableModel):

    translations = TranslatedFields(
        name=models.CharField(
            max_length=64,
            verbose_name='Название города'
        )
    )

    class Meta:
        verbose_name = 'Город доставки'
        verbose_name_plural = 'Города доставки'

    def __str__(self):
        return self.safe_translation_getter('name', any_language=True)


class Tariff(TranslatableModel):

    translations = TranslatedFields(
        name=models.CharField(
            max_length=64,
            verbose_name='Название тарифа'
        )
    )

    class Meta:
        verbose_name = 'Тариф доставки'
        verbose_name_plural = 'Тарифы доставки'

    def __str__(self):
        return self.safe_translation_getter('name', any_language=True)


class BaseDelivery(models.Model):

    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        verbose_name='Город'
    )

    tariff = models.ForeignKey(
        Tariff,
        on_delete=models.CASCADE,
        verbose_name='Тариф доставки'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена доставки'
    )

    days_min = models.IntegerField(
        verbose_name='Минимальное количество дней доставки'
    )

    days_max = models.IntegerField(
        verbose_name='Максимальное количество дней доставки'
    )

    class Meta:
        abstract = True
        verbose_name = 'Доставка'
        verbose_name_plural = 'Доставки'

    def __str__(self):
        return (
            f'{self.tariff.safe_translation_getter('name', any_language=True)} -'
            f' {self.city.safe_translation_getter('name', any_language=True)}:'
            f' {self.price} $, {self.days_min}-{self.days_max} дней'
        )


class Delivery(BaseDelivery):

    class Meta:
        verbose_name = 'Выбранная доставка'
        verbose_name_plural = 'Выбранные доставки'


class DeliveryVariant(BaseDelivery):

    category = mptt_models.TreeForeignKey(
        product_component_models.Category,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Категория товара'
    )

    class Meta:
        verbose_name = 'Доставка'
        verbose_name_plural = 'Доставки'

    def __str__(self):
        return (
            f'{self.tariff.safe_translation_getter('name', any_language=True)} -'
            f' {self.city.safe_translation_getter('name', any_language=True)}'
            f' ({self.category.safe_translation_getter('name', any_language=True)})'
        )
