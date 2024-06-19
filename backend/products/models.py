"""Модуль с логикой моделей продуктов."""

from django.core.validators import MinValueValidator
from django.db import models
from slugify import slugify

from components.models import (Brand, ProductSubType, Color,
                               ManufacturerCountry, Size)

# один цвет
# is_famous через связные таблицы


class Product(models.Model):
    """Модель продуктов."""

    name = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        null=True,
        blank=True,
    )

    image = models.ImageField(
        upload_to='products-images/',
        null=True,
        blank=True,
    )

    subTypes = models.ManyToManyField(
        ProductSubType,
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        db_index=True,
    )
    article_number = models.CharField(max_length=10)
    amount = models.PositiveIntegerField()
    compound = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
    )
    price = models.DecimalField(
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
        choices=SEASON_CHOICES,
        null=True,
        blank=True,
    )

    pattern = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )

    # несколько неповторяющихся цветов

    color = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        db_index=True,
    )

    manufacturerCountry = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # несколько повторяющихся размеров

    size = models.ForeignKey(
        Size,
        on_delete=models.CASCADE,
    )

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
    )

    is_famous = models.BooleanField()

    date_and_time = models.DateTimeField(
        'Время и дата публикации',
        auto_now_add=True
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return self.name

    def save(self, *args, **kwargs):
        """Переводит значение в slug и сохраняет."""
        self.slug = slugify(
            f'{self.article_number}-{self.name}-{self.color.name}'
        )
        return super().save(*args, **kwargs)

    class Meta:
        """Сортирует по слагу, по убыванию."""

        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-slug']
