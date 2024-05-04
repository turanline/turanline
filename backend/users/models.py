"""Модуль с логикой пользовательских моделей."""

from django.contrib.auth.models import AbstractUser
from django.db import models

from products.models import Product
from products.validators import validate_positive_number


class User(AbstractUser):
    """Модель пользователя."""

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
        null=True,
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


class Order(models.Model):
    """Модель заказа."""

    BANK_TRANSFER = 'BT'
    BY_CARD = 'BC'
    BILLING = 'BG'
    BY_CRYPTOCURRENCY = 'CR'
    BY_PAYPAL = 'PP'

    PAYMENT_METHODS = [
        (BANK_TRANSFER, 'Bank Transfer'),
        (BY_CARD, 'By card'),
        (BILLING, 'By billing'),
        (BY_CRYPTOCURRENCY, 'By cryptocurrency'),
        (BY_PAYPAL, 'By PayPal service'),
    ]

    CREATED = 'CR'
    PROCESSED = 'PR'
    COLLECTED = 'CD'
    FINISHED = 'FD'

    ORDER_STATUSES = [
        (CREATED, 'Created'),
        (PROCESSED, 'Processed'),
        (COLLECTED, 'Collected'),
        (FINISHED, 'Finished'),
    ]

    address = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHODS,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=50,
        choices=ORDER_STATUSES,
        null=True,
        blank=True,
    )

    created_date = models.DateField(
        null=True,
        blank=True,
    )

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            validate_positive_number,
        ],
        null=True,
        blank=True,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Заказ: {self.pk} состояние '
                f'{self.status} (вледелец: {self.user})')

    class Meta:
        """Сортирует по методам оплаты по убыванию."""

        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-payment_method']


class OrderProduct(models.Model):
    """Модель объекта включенного в состав заказа."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='order_products',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )
    amount = models.PositiveIntegerField()

    class Meta:
        """Сортирует по количеству."""

        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Товар {self.product} [{self.order}] '
                f'в количестве {self.amount} шт.')
