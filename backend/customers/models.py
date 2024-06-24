from django.db import models

from users.models import User
from products.models import Product


class Customer(models.Model):
    """Модель пользователя."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )

    favorites = models.ManyToManyField(
        Product,
        blank=True,
    )

    company = models.CharField(
        max_length=2048,
        null=True,
        blank=True,
    )

    address = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'Пользователь {self.username}'


class Review(models.Model):
    """Модель отзыва на продукт."""

    text = models.TextField()
    created_datetime = models.DateTimeField(
        auto_now_add=True,
        null=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )

    class Meta:
        """Уникальность пар user - product."""

        unique_together = ('user', 'product')

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Review {self.pk} on {self.product.pk} '
                f'by user {self.user.username}')
