"""Модуль с логикой моделей продуктов."""

from django.core.validators import MinValueValidator
from django.db import models
from slugify import slugify


class Color(models.Model):
    """Модель цвета."""

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    class Meta:
        """Сортирует по названию по убыванию."""

        verbose_name = 'Product color'
        verbose_name_plural = 'Product colors'
        ordering = ['-name']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'{self.name} цвет'


class Brand(models.Model):
    """Модель бренда."""

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    class Meta:
        """Сортирует по названию по убыванию."""

        verbose_name = 'Product brand'
        verbose_name_plural = 'Product brands'
        ordering = ['-name']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return self.name


def category_upload_to(instance, filename) -> str:
    return '/'.join(['products-category', str(instance.name), filename])


class Category(models.Model):
    """Модель категорий."""

    name = models.CharField(
        max_length=255,
        unique=True,
    )
    image = models.ImageField(
        upload_to=category_upload_to,
        null=True,
        blank=True,
    )

    class Meta:
        """Сортирует по названию по убыванию."""

        verbose_name = 'Product category'
        verbose_name_plural = 'Product categories'
        ordering = ['-name']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'Категория: {self.name}'


class ProductType(models.Model):
    """Модель типа продукта."""

    name = models.CharField(
        max_length=255,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
    )

    class Meta:
        """
        Сортирует по названию по убыванию.

        Уникальность пар name - category.
        """

        verbose_name = 'Product type'
        verbose_name_plural = 'Product types'
        ordering = ['-name']
        unique_together = ('name', 'category')

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'Тип: {self.name} [Категория: {self.category.name}]'


class ProductSubType(models.Model):
    """Модель подкатегорий."""

    name = models.CharField(
        max_length=255,
    )

    type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Подкатегория: {self.name} [Тип: {self.type.name} '
                f'Категория: {self.type.category.name}]')

    class Meta:
        """
        Сортирует по названию по убыванию.

        Уникальность пар name - type.
        """

        verbose_name = 'Product subtype'
        verbose_name_plural = 'Product subtypes'
        ordering = ['-name']
        unique_together = ('name', 'type')


class ManufacturerCountry(models.Model):
    """Модель страны производителя продукта."""

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    class Meta:
        """Сортирует по названию по убыванию."""

        verbose_name = 'Product manufacturer country'
        verbose_name_plural = 'Product manufacturer countries'
        ordering = ['-name']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return self.name


class Size(models.Model):
    """Модель размера продукта."""

    name = models.CharField(
        max_length=10,
        unique=True,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'{self.name} size'

    class Meta:
        """Сортировок нет."""

        verbose_name = 'Product size'
        verbose_name_plural = 'Product sizes'


def products_upload_to(instance, filename) -> str:
    return '/'.join(['products-images', str(instance.name), filename])


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
        upload_to=products_upload_to,
        null=True,
        blank=True,
    )
    sub_types = models.ManyToManyField(
        ProductSubType,
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        db_index=True,
    )
    vendor_code = models.CharField(max_length=9)
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
    season = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )
    pattern = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )
    color = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        db_index=True,
    )
    manufacturer_country = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
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

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return self.name

    def save(self, *args, **kwargs):
        """Переводит значение в slug и сохраняет."""
        self.slug = slugify(
            f'{str(self.vendor_code)}-{str(self.name)}-{str(self.color.name)}'
        )
        return super().save(*args, **kwargs)

    class Meta:
        """Сортирует по слагу по убыванию."""

        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-slug']
