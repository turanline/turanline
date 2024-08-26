import uuid

from django.db import models

from customers import models as customer_models
from delivery import models as delivery_models
from product_components import models as product_components_models
from products import models as product_models

from . import enums


class BaseCartOrderModel(models.Model):

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель'
    )

    class Meta:
        abstract = True


class OrderProducts(BaseCartOrderModel):

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.PROTECT,
        verbose_name='Продукт'
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество'
    )

    color = models.ForeignKey(
        product_components_models.Color,
        on_delete=models.PROTECT,
        verbose_name='Цвет'
    )

    sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Сумма'
    )

    class Meta:
        ordering = ['amount']
        verbose_name = 'Продукт в корзине'
        verbose_name_plural = 'Продукты в корзинах'

    def __str__(self) -> str:
        return (
            f'{self.product} - {self.amount} шт.'
            f' (цвет: {self.color})'
        )


class Cart(BaseCartOrderModel):

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Общая сумма корзины'
    )

    order_products = models.ManyToManyField(
        OrderProducts,
        related_name='carts',
        verbose_name='Продукты в корзине'
    )

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self) -> str:
        return (
            f'Корзина покупателя {self.customer}'
            f' на сумму {self.total_sum}'
        )


class Order(BaseCartOrderModel):

    order_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    payment = models.CharField(
        max_length=16,
        null=True,
        blank=True,
        verbose_name='Платеж'
    )

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Общая сумма заказа'
    )

    status = models.CharField(
        max_length=50,
        choices=enums.OrderStatuses,
        default=enums.OrderStatuses.CREATED,
        verbose_name='Статус заказа'
    )

    created_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата создания'
    )

    delivery = models.ForeignKey(
        delivery_models.Delivery,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Тип доставки'
    )

    is_paid = models.BooleanField(
        default=False,
        verbose_name='Оплачено'
    )

    order_products = models.ManyToManyField(
        OrderProducts,
        verbose_name='Продукты в заказе'
    )

    class Meta:
        ordering = ['-created_date']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self) -> str:
        return (
            f'Заказ {self.order_id} от {self.customer} на сумму'
            f' {self.total_sum} (Статус: {self.status})'
        )
