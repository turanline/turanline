import random

from django.core.validators import MinValueValidator
from django.db import models
from parler.models import TranslatableModel, TranslatedFieldsModel
from slugify import slugify
from decimal import Decimal

from . import enums
from product_components import models as product_components_models
from users import models as user_models

# один цвет
# is_famous через связные таблицы


class Product(TranslatableModel):
    """Модель продуктов."""

    provider = models.ForeignKey(
        user_models.User,
        on_delete=models.CASCADE,
        verbose_name='Поставщик',
    )

    first_image = models.ImageField(
        'Первая картинка товара',
        null=True,
        default=None
    )

    second_image = models.ImageField(
        'Вторая картинка товара',
        null=True,
        default=None
    )

    third_image = models.ImageField(
        'Третья картинка товара',
        null=True,
        default=None
    )

    fourth_image = models.ImageField(
        'Четвертая картинка товара',
        null=True,
        default=None
    )

    fifth_image = models.ImageField(
        'Пятая картинка товара',
        null=True,
        default=None
    )

    subTypes = models.ManyToManyField(
        product_components_models.ProductSubType,
        verbose_name='Подтипы товаров'
    )

    brand = models.ForeignKey(
        product_components_models.Brand,
        on_delete=models.CASCADE,
        db_index=True,
        verbose_name='Бренд товара'
    )

    article_number = models.CharField(
        'Артикул',
        max_length=10,
        unique=True
    )

    amount = models.PositiveIntegerField(
        'Количество товара'
    )

    price = models.DecimalField(
        'Цена товара',
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(
                Decimal(0),
                message='the price cannot be a negative number'
            ),
        ],
        db_index=True,
    )

    season = models.CharField(
        'Сезон для ношения',
        choices=enums.SeasonChoices,
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
        product_components_models.Color,
        on_delete=models.CASCADE,
        db_index=True,
        verbose_name='Цвет товара'
    )

    manufacturerCountry = models.ForeignKey(
        product_components_models.ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Страна производителя товара'
    )

    # несколько повторяющихся размеров

    size = models.ForeignKey(
        product_components_models.Size,
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
        'Популярный товар?',
        default=False
    )

    status = models.CharField(
        'Статус проверки модерацией',
        choices=enums.ProductStatus,
        default=enums.ProductStatus.UNDER_CONSIDERATION
    )

    date_and_time = models.DateTimeField(
        'Время и дата публикации',
        auto_now_add=True
    )

    class Meta:
        ordering = ['-slug']

    def __str__(self) -> str:
        return f'Товар поставщика {self.provider.username}'

    def save(self, *args, **kwargs):
        self.article_number = f'{random.randrange(0, 10000)}'
        self.slug = slugify(
            f'{self.provider.username}-{self.article_number}'
        )
        return super().save(*args, **kwargs)


class ProductStatusChangeArchive(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    old_status = models.CharField(
        'Старый статус',
        choices=enums.ProductStatus
    )
    new_status = models.CharField(
        'Новый статус',
        choices=enums.ProductStatus
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    provider = models.ForeignKey(user_models.User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']


class ProductTranslation(TranslatedFieldsModel):

    master = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.SET_NULL,
        related_name='translations'
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

    compound = models.CharField(
        'Состав товара',
        max_length=1024,
        null=True,
        blank=True,
    )

    class Meta:
        unique_together = ('language_code', 'master')
