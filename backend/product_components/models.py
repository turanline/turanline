from django.core.validators import RegexValidator
from django.db import models


class BaseModel(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    class Meta:
        abstract = True
        ordering = ['-name']


class Color(BaseModel):
    """Модель цвета."""

    color = models.CharField(
        unique=True,
        max_length=7,
        validators=[
            RegexValidator(
                regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Не является HEX цветом'
            )
        ],
        verbose_name='Цветовой HEX-код'
    )

    class Meta(BaseModel.Meta):
        verbose_name = 'Product color'
        verbose_name_plural = 'Product colors'


class Brand(BaseModel):
    """Модель бренда."""

    image = models.ImageField(
        upload_to='brand-images/',
        null=True,
        verbose_name='Картинка бренда'
    )

    class Meta(BaseModel.Meta):
        verbose_name = 'Product brand'
        verbose_name_plural = 'Product brands'


class Category(BaseModel):
    """Модель категорий."""

    class Meta(BaseModel.Meta):
        verbose_name = 'Product category'
        verbose_name_plural = 'Product categories'


class ProductType(BaseModel):
    """Модель типа продукта."""

    name = models.CharField(
        max_length=255,
    )

    image = models.ImageField(
        upload_to='subtype_images/',
        null=True,
        verbose_name='Картинка подкатегории'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='types'
    )

    class Meta(BaseModel.Meta):
        verbose_name = 'Product type'
        verbose_name_plural = 'Product types'
        unique_together = ('name', 'category')

    def __str__(self) -> str:
        return f'Тип: {self.name} [Категория: {self.category.name}]'


class ProductSubType(BaseModel):
    """Модель подкатегорий."""

    type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
        related_name='subtypes'
    )

    class Meta(BaseModel.Meta):
        verbose_name = 'Product subtype'
        verbose_name_plural = 'Product subtypes'
        unique_together = ('name', 'type')

    def __str__(self) -> str:
        return (f'Подкатегория: {self.name} [Тип: {self.type.name} '
                f'Категория: {self.type.category.name}]')


class ManufacturerCountry(BaseModel):
    """Модель страны производителя продукта."""

    class Meta(BaseModel.Meta):
        verbose_name = 'Product manufacturer country'
        verbose_name_plural = 'Product manufacturer countries'


class Size(BaseModel):
    """Модель размера продукта."""

    name = models.CharField(
        max_length=6,
        unique=True
    )

    class Meta:
        verbose_name = 'Product size'
        verbose_name_plural = 'Product sizes'
