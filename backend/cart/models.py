from django.db import models
from django.core.validators import MinValueValidator

from users.models import User
from products.models import Product


class Order(models.Model):
    """Модель объекта включенного в состав заказа."""

    PAYMENT_METHODS = [
        ('BT', 'Bank Transfer'),
        ('BC', 'By card'),
        ('BG', 'By billing'),
        ('CR', 'By cryptocurrency'),
        ('PP', 'By PayPal service'),
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
            MinValueValidator(
                0,
                message='the total sum cannot be a negative number'
            ),
        ],
        null=True,
        blank=True,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
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
    """Модель заказа."""

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

    date = models.DateField(
        'Дата заказа',
        auto_now_add=True
    )

    class Meta:
        """Сортирует по количеству."""

        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Товар {self.product} [{self.order}] '
                f'в количестве {self.amount} шт.')
