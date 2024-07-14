from django.db import models
from django.core.validators import MinValueValidator

from . import enums
from customers import models as customer_models
from products import models as product_models
from product_components import models as product_components_models


class OrderProduct(models.Model):
    """Модель объекта включенного в состав заказа (карточка товара, которую добавляют в заказ)."""

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.CASCADE
    )

    amount = models.PositiveIntegerField()

    color = models.ForeignKey(
        product_components_models.Color,
        on_delete=models.CASCADE
    )

    size = models.ForeignKey(
        product_components_models.Size,
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def __str__(self) -> str:
        return f'Товар {self.product} в количестве {self.amount} шт.'


class Order(models.Model):
    """Модель заказа."""

    address = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
        verbose_name='Адрес доставки заказа'
    )

    payment_method = models.CharField(
        max_length=50,
        choices=enums.PaymentMethods,
        default=enums.PaymentMethods.BY_CARD,
        verbose_name='Метод оплаты заказа'
    )

    status = models.CharField(
        max_length=50,
        choices=enums.OrderStatuses,
        default=enums.OrderStatuses.CREATED,
        verbose_name='Статус закаказа'
    )

    created_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Дата создания заказа'
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
        verbose_name='Общая сумма заказа'
    )

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель оформивший заказ'
    )

    order_products = models.ManyToManyField(OrderProduct)

    def __str__(self) -> str:
        return (f'Заказ: {self.pk} состояние '
                f'{self.status} (вледелец: {self.customer})')

    class Meta:
        ordering = ['-payment_method']
