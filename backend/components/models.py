from django.core.validators import RegexValidator
from django.db import models


class Color(models.Model):
    """Модель цвета."""

    name = models.CharField(
        'Название цвета',
        max_length=255,
        unique=True,
    )

    color = models.CharField(
        'Цветовой HEX-код',
        unique=True,
        max_length=7,
        validators=[
            RegexValidator(
                regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Не является HEX цветом'
            )
        ]
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

    image = models.ImageField(
        'Картинка бренда',
        upload_to='brand-images/',
        null=True,
    )

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


class Category(models.Model):
    """Модель категорий."""

    name = models.CharField(
        max_length=255,
        unique=True,
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

    image = models.ImageField(
        'Картинка подкатегории',
        upload_to='subtype_images/',
        null=True,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='types'
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
        related_name='subtypes'
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

# добавить возможность иметь несколько размеров
# 5XL 7XL отдельная графа


class Size(models.Model):
    """Модель размера продукта."""

    name = models.CharField(
        max_length=6,
        unique=True
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'{self.name} size'

    class Meta:
        """Сортировок нет."""

        verbose_name = 'Product size'
        verbose_name_plural = 'Product sizes'
