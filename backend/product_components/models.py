from django.core.validators import RegexValidator
from django.db import models

from mptt.models import MPTTModel, TreeForeignKey
from parler.models import TranslatableModel, TranslatedFieldsModel

from . import managers


class Category(MPTTModel, TranslatableModel):

    image = models.ImageField(
        upload_to='category_images/',
        null=True,
        verbose_name='Картинка категории'
    )

    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг категории'
    )

    objects = managers.CategoryManager()

    class Meta:
        verbose_name = 'Product category'
        verbose_name_plural = 'Product categories'

    def save(self, *args, **kwargs):
        if self.slug:
            return super().save(*args, **kwargs)
        self.slug = f'{self.safe_translation_getter('name', any_language=True).lower()}'
        return super().save(*args, **kwargs)


class Color(TranslatableModel):

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

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг цвета'
    )

    class Meta:
        verbose_name = 'Product color'
        verbose_name_plural = 'Product colors'

    def save(self, *args, **kwargs):
        if self.slug:
            return super().save(*args, **kwargs)
        self.slug = f'{self.safe_translation_getter('name', any_language=True).lower()}'
        return super().save(*args, **kwargs)


class Brand(models.Model):

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    image = models.ImageField(
        upload_to='brand-images/',
        null=True,
        verbose_name='Картинка бренда'
    )

    class Meta:
        ordering = ['-name']
        verbose_name = 'Product brand'
        verbose_name_plural = 'Product brands'


class ManufacturerCountry(TranslatableModel):

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг страны производителя'
    )

    class Meta:
        verbose_name = 'Product manufacturer country'
        verbose_name_plural = 'Product manufacturer countries'


    def save(self, *args, **kwargs):
        if self.slug:
            return super().save(*args, **kwargs)
        self.slug = f'{self.safe_translation_getter('name', any_language=True).lower()}'
        return super().save(*args, **kwargs)


class Size(models.Model):
    """Модель размера продукта."""

    name = models.CharField(
        max_length=6,
        unique=True
    )

    class Meta:
        verbose_name = 'Product size'
        verbose_name_plural = 'Product sizes'


class CategoryTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='translations'
    )

    name = models.CharField(
        max_length=255,
        unique=True
    )

    class Meta:
        unique_together = ('language_code', 'master')


class ColorTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        related_name='translations'
    )

    name = models.CharField(
        max_length=255,
        unique=True
    )

    class Meta:
        unique_together = ('language_code', 'master')


class ManufacturerCountryTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.CASCADE,
        related_name='translations'
    )

    name = models.CharField(
        max_length=255,
        unique=True
    )

    class Meta:
        unique_together = ('language_code', 'master')
