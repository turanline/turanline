"""Модуль с логикой моделей продуктов."""

from django.core.validators import MinValueValidator
from django.db import models
from slugify import slugify

from product_components.models import (Brand, ProductSubType, Color,
                                       ManufacturerCountry, Size)
from users.models import User

# один цвет
# is_famous через связные таблицы


class Product(models.Model):
    """Модель продуктов."""

    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Поставщик',
    )

    name = models.CharField(
        'Название товара',
        max_length=255,
    )

    description = models.TextField(
        'Описание товара',
        null=True,
        blank=True,
    )

    image = models.ImageField(
        'Картинка товара',
        upload_to='products-images/',
        null=True,
        blank=True,
    )

    subTypes = models.ManyToManyField(
        ProductSubType,
        verbose_name='Подтипы товаров'
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        db_index=True,
        verbose_name='Бренд товара'
    )

    article_number = models.CharField(
        'Артикул',
        max_length=10
    )

    amount = models.PositiveIntegerField(
        'Количество товара'
    )

    compound = models.CharField(
        'Состав товара',
        max_length=1024,
        null=True,
        blank=True,
    )

    price = models.DecimalField(
        'Цена товара',
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(
                0,
                message='the price cannot be a negative number'
            ),
        ],
        db_index=True,
    )

    SEASON_CHOICES = [
        ('S', 'Summer'),
        ('W', 'Winter'),
        ('DS', 'Demi-season'),
        ('AS', 'All-season')
    ]

    season = models.CharField(
        'Сезон для ношения',
        choices=SEASON_CHOICES,
        null=True,
        blank=True,
    )

    pattern = models.CharField(
        'Узор товара',
        max_length=50,
        null=True,
        blank=True,
    )

    # несколько неповторяющихся цветов

    color = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        db_index=True,
        verbose_name='Цвет товара'
    )

    manufacturerCountry = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Страна производителя товара'
    )

    # несколько повторяющихся размеров

    size = models.ForeignKey(
        Size,
        on_delete=models.CASCADE,
        verbose_name='Размер товара'
    )

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг товара'
    )

    is_famous = models.BooleanField(
        'Популярный товар?'
    )

    PRODUCT_STATUS = [
        ('UC', 'Under consideration'),
        ('R', 'Rejected'),
        ('A', 'Accepted')
    ]

    status = models.CharField(
        'Статус проверки модерацией',
        choices=PRODUCT_STATUS,
        null=False,
        blank=False
    )

    date_and_time = models.DateTimeField(
        'Время и дата публикации',
        auto_now_add=True
    )

    class Meta:
        """Сортирует по слагу, по убыванию."""

        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-slug']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'Товар {self.name} поставщика {self.provider.username}'

    def save(self, *args, **kwargs):
        """Переводит значение в slug и сохраняет."""
        self.slug = slugify(
            f'{self.article_number}-{self.name}-{self.color.name}'
        )
        return super().save(*args, **kwargs)
