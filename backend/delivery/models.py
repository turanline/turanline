from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from mptt import models as mptt_models

from product_components import models as product_component_models


class City(TranslatableModel):

    translations = TranslatedFields(
        name=models.CharField(max_length=64)
    )

    class Meta:
        verbose_name = 'Delivery city'
        verbose_name_plural = 'Delivery cities'

    def __str__(self):
        return self.name


class Tariff(TranslatableModel):

    translations = TranslatedFields(
        name=models.CharField(max_length=64)
    )

    class Meta:
        verbose_name = 'Delivery tariff'
        verbose_name_plural = 'Delivery tariffs'

    def __str__(self):
        return self.name


class Delivery(models.Model):

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

    category = mptt_models.TreeManyToManyField(
        product_component_models.Category,
        verbose_name='Категория товара'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена доставки'
    )

    days_min = models.IntegerField(
        verbose_name='Минимальное кол-во дней доставки'
    )

    days_max = models.IntegerField(
        verbose_name='Максимальное кол-во дней доставки'
    )

    class Meta:
        verbose_name = 'Delivery'
        verbose_name_plural = 'Deliveries'

    def __str__(self):
        return f'{self.tariff.name}--{self.city.name}'
