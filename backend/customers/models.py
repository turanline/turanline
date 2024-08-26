from django.db import models

from products import models as product_models
from users import models as user_models


class Customer(models.Model):

    user = models.OneToOneField(
        user_models.User,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name='Пользователь'
    )

    favorites = models.ManyToManyField(
        product_models.Product,
        blank=True,
        verbose_name='Избранные продукты'
    )

    company = models.CharField(
        max_length=2048,
        null=True,
        blank=True,
        verbose_name='Компания'
    )

    address = models.TextField(
        blank=True,
        null=True,
        verbose_name='Адрес'
    )

    def __str__(self) -> str:
        return f'Клиент: {self.user.username}'

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'


class Review(models.Model):

    text = models.TextField(
        verbose_name='Текст отзыва'
    )

    created_datetime = models.DateTimeField(
        auto_now_add=True,
        null=False,
        verbose_name='Дата и время создания'
    )

    user = models.ForeignKey(
        user_models.User,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Пользователь'
    )

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.CASCADE,
        verbose_name='Продукт'
    )

    def __str__(self) -> str:
        return f'Отзыв от {self.user.username} на {self.product.name}'

    class Meta:
        ordering = ['-created_datetime']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
