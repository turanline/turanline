from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from mptt import models as mptt_models
from parler.models import TranslatableModel, TranslatedFieldsModel

from mssite import storages
from product_components import models as product_component_models
from providers import models as provider_models

from . import enums


class Product(TranslatableModel):

    provider = models.ForeignKey(
        provider_models.Provider,
        on_delete=models.CASCADE,
        verbose_name='Поставщик'
    )

    category = mptt_models.TreeForeignKey(
        product_component_models.Category,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Категория товаров'
    )

    article_number = models.CharField(
        max_length=9,
        db_index=True,
        unique=True,
        verbose_name='Артикул'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(
                Decimal(0),
                message='Цена не может быть отрицательной'
            ),
        ],
        db_index=True,
        verbose_name='Цена комплекта'
    )

    season = models.CharField(
        choices=enums.SeasonChoices,
        null=True,
        blank=True,
        verbose_name='Сезон для ношения'
    )

    mold = models.CharField(
        choices=enums.MoldChoices,
        default=enums.MoldChoices.NO_MOLD,
        verbose_name='Лекало'
    )

    color = models.ManyToManyField(
        product_component_models.Color,
        through='ProductColor',
        through_fields=['product', 'color'],
        verbose_name='Цвет товара'
    )

    manufacturerCountry = models.ForeignKey(
        product_component_models.ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Страна производителя товара'
    )

    size = models.ManyToManyField(
        product_component_models.Size,
        through='ProductSize',
        through_fields=['product', 'size'],
        verbose_name='Размер товара'
    )

    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name='Вес товара'
    )

    is_famous = models.BooleanField(
        default=False,
        verbose_name='Известный товар'
    )

    status = models.CharField(
        choices=enums.ProductStatus,
        default=enums.ProductStatus.ACTIVE,
        verbose_name='Статус проверки модерацией'
    )

    date_and_time = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата и время публикации'
    )

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self) -> str:
        return (
            f'{self.safe_translation_getter('name', any_language=True)}'
            f' (Артикул: {self.article_number}, Поставщик: {self.provider.user.username})'
        )


class ProductStatusChangeArchive(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name='Товар'
    )

    old_status = models.CharField(
        choices=enums.ProductStatus,
        verbose_name='Старый статус'
    )

    new_status = models.CharField(
        choices=enums.ProductStatus,
        verbose_name='Новый статус'
    )

    changed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата и время изменения статуса'
    )

    provider = models.ForeignKey(
        provider_models.Provider,
        on_delete=models.CASCADE,
        verbose_name='Поставщик'
    )

    class Meta:
        ordering = ['id']
        verbose_name = 'Архив изменений статуса товара'
        verbose_name_plural = 'Архив изменений статуса товаров'

    def __str__(self) -> str:
        return (
            f'Изменение статуса товара {self.product.safe_translation_getter('name', any_language=True)}:'
            f' {self.old_status} → {self.new_status} (Поставщик: {self.provider.user.username})'
        )


class ProductTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.SET_NULL,
        related_name='translations',
        verbose_name='Основной товар'
    )

    name = models.CharField(
        max_length=255,
        verbose_name='Название товара'
    )

    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Описание товара'
    )

    compound = models.TextField(
        null=True,
        blank=True,
        verbose_name='Состав товара'
    )

    pattern = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Узор товара'
    )

    class Meta:
        unique_together = (
            'language_code',
            'master'
        )
        verbose_name = 'Перевод товара'
        verbose_name_plural = 'Переводы товаров'

    def __str__(self) -> str:
        return f'{self.name} ({self.language_code})'


class Image(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар'
    )

    image_file = models.ImageField(
        null=True,
        blank=True,
        upload_to='product_images/',
        storage=storages.OverwriteStorage(),
        verbose_name='Файл изображения'
    )

    position = models.IntegerField(
        verbose_name='Позиция изображения'
    )

    class Meta:
        ordering = ['position']
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'

    def __str__(self) -> str:
        return (
            f'Изображение для товара {self.product.safe_translation_getter('name', any_language=True)}'
            f' (Позиция: {self.position})'
        )


class ProductSize(models.Model):

    product = models.ForeignKey(
        Product,
        related_name='sizes',
        on_delete=models.CASCADE,
        verbose_name='Товар'
    )

    size = models.ForeignKey(
        product_component_models.Size,
        on_delete=models.CASCADE,
        verbose_name='Размер'
    )

    amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Количество товара для выбранного размера'
    )

    class Meta:
        verbose_name = 'Размер товара'
        verbose_name_plural = 'Размеры товаров'

    def __str__(self) -> str:
        return (
            f'{self.product.safe_translation_getter('name', any_language=True)} -'
            f' Размер: {self.size.name}, Количество: {self.amount}'
        )


class ProductColor(models.Model):

    product = models.ForeignKey(
        Product,
        related_name='colors',
        on_delete=models.CASCADE,
        verbose_name='Товар'
    )

    color = models.ForeignKey(
        product_component_models.Color,
        on_delete=models.CASCADE,
        related_name='color_amount',
        verbose_name='Цвет'
    )

    amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Количество товара для выбранного цвета'
    )

    class Meta:
        verbose_name = 'Цвет товара'
        verbose_name_plural = 'Цвета товаров'

    def __str__(self) -> str:
        return (
            f'{self.product.safe_translation_getter('name', any_language=True)} -'
            f' Цвет: {self.color.safe_translation_getter('name', any_language=True)},'
            f' Количество: {self.amount}'
        )
