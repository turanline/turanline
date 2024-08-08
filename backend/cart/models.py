from django.db import models

from . import enums
from customers import models as customer_models
from products import models as product_models
from delivery import models as delivery_models
from payment import models as payment_models
from product_components import models as product_components_models


class OrderProducts(models.Model):

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.CASCADE
    )

    amount = models.PositiveIntegerField()

    color = models.ForeignKey(
        product_components_models.Color,
        on_delete=models.CASCADE
    )

    sum = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        ordering = [
            'amount'
        ]
        verbose_name = 'Продукт в корзине'
        verbose_name_plural = 'Продукты в корзинах'

    def save(self, *args, **kwargs):
        product_sizes = product_models.ProductSize.objects.filter(
            product=self.product
        )
        total_sum = sum(product_size.amount * self.product.price for product_size in product_sizes)
        self.sum = total_sum * self.amount
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'Товар {self.product} в количестве {self.amount} шт.'


class Cart(models.Model):

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Общая сумма корзины'
    )

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель оформивший заказ'
    )

    order_products = models.ManyToManyField(
        OrderProducts
    )

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self) -> str:
        return f'Корзина: {self.customer}'


class Order(models.Model):

    payment = models.ForeignKey(
        payment_models.CardPayment,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
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
        verbose_name='Статус закаказа'
    )

    created_date = models.DateTimeField(
        auto_now_add=True,
        null=False
    )

    delivery = models.ForeignKey(
        delivery_models.Delivery,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name='Тип доставки'
    )

    is_paid = models.BooleanField(
        default=False
    )

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        null=False,
        verbose_name='Покупатель оформивший заказ'
    )

    order_products = models.ManyToManyField(
        OrderProducts
    )

    class Meta:
        ordering = [
            '-created_date'
        ]
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def save(self, *args, **kwargs):
        cart = Cart.objects.get(
            customer=self.customer
        )
        self.total_sum = cart.total_sum + self.delivery.price
        super().save(*args, **kwargs)
