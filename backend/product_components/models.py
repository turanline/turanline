from django.core.validators import RegexValidator
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from parler.models import TranslatableModel, TranslatedFieldsModel

from . import managers


class BaseModel(TranslatableModel):

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.slug:
            return super().save(*args, **kwargs)
        self.slug = f'{self.safe_translation_getter('name', any_language=True).lower()}'
        return super().save(*args, **kwargs)


class Category(
    MPTTModel,
    BaseModel
):

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
        related_name='children',
        verbose_name='Родительская категория'
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
        verbose_name = 'Категория продукта'
        verbose_name_plural = 'Категории продуктов'

    def __str__(self):
        return f'{self.safe_translation_getter('name', any_language=True)}'


class Color(BaseModel):

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
        verbose_name = 'Цвет продукта'
        verbose_name_plural = 'Цвета продуктов'

    def __str__(self):
        return f'{self.safe_translation_getter('name', any_language=True)} ({self.color})'


class ManufacturerCountry(BaseModel):

    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name='Слаг страны производителя'
    )

    class Meta:
        verbose_name = 'Страна производителя продукта'
        verbose_name_plural = 'Страны производителей продуктов'

    def __str__(self):
        return f'{self.safe_translation_getter('name', any_language=True)}'


class Size(models.Model):

    name = models.CharField(
        max_length=6,
        unique=True,
        verbose_name='Размер'
    )

    class Meta:
        verbose_name = 'Размер продукта'
        verbose_name_plural = 'Размеры продуктов'

    def __str__(self):
        return self.name


class CategoryTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='translations',
        verbose_name='Категория'
    )

    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='Название'
    )

    class Meta:
        unique_together = (
            'language_code',
            'master'
        )

    def __str__(self):
        return f'{self.name} ({self.language_code})'


class ColorTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        related_name='translations',
        verbose_name='Цвет'
    )

    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='Название'
    )

    class Meta:
        unique_together = (
            'language_code',
            'master'
        )

    def __str__(self):
        return f'{self.name} ({self.language_code})'


class ManufacturerCountryTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.CASCADE,
        related_name='translations',
        verbose_name='Страна производителя'
    )

    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='Название'
    )

    class Meta:
        unique_together = (
            'language_code',
            'master'
        )

    def __str__(self):
        return f'{self.name} ({self.language_code})'
