from django.db import models

from . import enums
from customers import models as customer_models
from products import models as product_models
from product_components import models as product_components_models


class OrderProduct(models.Model):

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

    sum = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def save(self, *args, **kwargs):
        self.sum = self.product.price * self.amount
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'Товар {self.product} в количестве {self.amount} шт.'


class Order(models.Model):

    address = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
        verbose_name='Адрес доставки заказа'
    )

    status = models.CharField(
        max_length=50,
        choices=enums.OrderStatuses,
        blank=True,
        null=True,
        verbose_name='Статус закаказа'
    )

    delivery_type = models.CharField(
        max_length=50,
        choices=enums.DeliveryTypes,
        blank=True,
        null=True,
        verbose_name='Тип доставки'
    )

    created_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Дата создания заказа'
    )

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Общая сумма заказа'
    )

    delivery_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Сумма доставки'
    )

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель оформивший заказ'
    )

    min_delivery_period = models.DateField(
        blank=True,
        null=True,
        verbose_name='Минимальный период доставки'
    )

    max_delivery_period = models.DateField(
        blank=True,
        null=True,
        verbose_name='Максимальный период доставки'
    )

    order_products = models.ManyToManyField(OrderProduct)

    class Meta:
        ordering = ['-created_date']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.total_sum = self.calculate_total_sum()
        super().save(update_fields=['total_sum'])

    def __str__(self) -> str:
        return (f'Заказ: {self.pk} состояние '
                f'{self.status} (вледелец: {self.customer})')

    def calculate_total_sum(self):
        delivery_price = self.delivery_price if self.delivery_type else 0
        order_cost = sum(item.sum for item in self.order_products.all())
        return order_cost + delivery_price
