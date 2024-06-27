from django.db import models
from django.core.validators import MinValueValidator

from . import enums
from users import models as user_models
from products import models as product_models
from product_components import models as product_components_models


class Order(models.Model):
    """Модель заказа."""

    address = models.CharField(
        'Адрес доставки заказа',
        max_length=1024,
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        'Метод оплаты заказа',
        max_length=50,
        choices=enums.PaymentMethods,
        null=True,
        blank=True,
    )

    status = models.CharField(
        'Статус закаказа',
        max_length=50,
        choices=enums.OrderStatuses,
        null=True,
        blank=True,
    )

    created_date = models.DateField(
        'Дата создания заказа',
        null=True,
        blank=True,
    )

    total_sum = models.DecimalField(
        'Общая сумма заказа',
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
        user_models.User,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель оформивший заказ'
    )

    def __str__(self) -> str:
        return (f'Заказ: {self.pk} состояние '
                f'{self.status} (вледелец: {self.user})')

    class Meta:
        ordering = ['-payment_method']


class OrderProduct(models.Model):
    """Модель объекта включенного в состав заказа."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='order_products',
    )

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.CASCADE
    )

    amount = models.PositiveIntegerField()

    date = models.DateField(
        'Дата заказа',
        auto_now_add=True
    )

    color = models.ManyToManyField(product_components_models.Color)

    size = models.ManyToManyField(product_components_models.Size)

    class Meta:
        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def __str__(self) -> str:
        return (f'Товар {self.product} [{self.order}] '
                f'в количестве {self.amount} шт.')
