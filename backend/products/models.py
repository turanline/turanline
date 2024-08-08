import random

from django.core.validators import MinValueValidator
from django.db import models
from mptt import models as mptt_models
from parler.models import TranslatableModel, TranslatedFieldsModel
from slugify import slugify
from decimal import Decimal

from . import enums
from product_components import models as product_component_models
from users import models as user_models
from mssite import storages


class Product(TranslatableModel):

    provider = models.ForeignKey(
        user_models.User,
        on_delete=models.CASCADE,
        verbose_name='Поставщик',
    )

    category = mptt_models.TreeManyToManyField(
        product_component_models.Category,
        verbose_name='Категории товаров'
    )

    brand = models.ForeignKey(
        product_component_models.Brand,
        on_delete=models.CASCADE,
        db_index=True,
        verbose_name='Бренд товара'
    )

    article_number = models.CharField(
        max_length=10,
        unique=True,
        verbose_name='Артикул'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(
                Decimal(0),
                message='the price cannot be a negative number'
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

    pattern = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='Узор товара'
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

    weight = models.PositiveIntegerField(
        verbose_name='Вес товара'
    )

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг товара'
    )

    is_famous = models.BooleanField(
        default=False
    )

    status = models.CharField(
        choices=enums.ProductStatus,
        default=enums.ProductStatus.UNDER_CONSIDERATION,
        verbose_name='Статус проверки модерацией'
    )

    date_and_time = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время и дата публикации'
    )

    class Meta:
        ordering = ['-slug']

    def __str__(self) -> str:
        return f'Товар поставщика {self.provider.username}'

    def save(self, *args, **kwargs):
        if self.slug and self.article_number:
            return super().save(*args, **kwargs)
        self.article_number = f'{random.randrange(0, 10000)}'
        self.slug = slugify(
            f'{self.provider.username}-{self.article_number}'
        )
        return super().save(*args, **kwargs)


class ProductStatusChangeArchive(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    old_status = models.CharField(
        choices=enums.ProductStatus,
        verbose_name='Старый статус'
    )

    new_status = models.CharField(
        choices=enums.ProductStatus,
        verbose_name='Новый статус'
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    provider = models.ForeignKey(
        user_models.User,
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = [
            'id'
        ]


class ProductTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.SET_NULL,
        related_name='translations'
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

    class Meta:
        unique_together = (
            'language_code',
            'master'
        )


class Image(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image_file = models.ImageField(
        null=True,
        blank=True,
        upload_to='product_images/',
        storage=storages.OverwriteStorage(),
    )

    position = models.IntegerField(
        verbose_name='Позиция фотографии'
    )

    class Meta:
        ordering = [
            'position'
        ]


class ProductSize(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    size = models.ForeignKey(
        product_component_models.Size,
        on_delete=models.CASCADE,
        related_name='size_amount'
    )

    amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Количество товара для выбранного размера'
    )


class ProductColor(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    color = models.ForeignKey(
        product_component_models.Color,
        on_delete=models.CASCADE,
        related_name='color_amount'
    )

    amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Количество товара для выбранного цвета'
    )
