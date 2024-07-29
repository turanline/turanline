from django.db import models

from users import models as user_models
from products import models as product_models


class Customer(models.Model):

    user = models.OneToOneField(
        user_models.User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )

    favorites = models.ManyToManyField(
        product_models.Product,
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
        return f'Customer {self.user.username}'


class Review(models.Model):

    text = models.TextField()

    created_datetime = models.DateTimeField(
        auto_now_add=True,
        null=False,
    )

    user = models.ForeignKey(
        user_models.User,
        on_delete=models.SET_NULL,
        null=True,
    )

    product = models.ForeignKey(
        product_models.Product,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'

    def __str__(self) -> str:
        return (f'Review {self.pk} on {self.product.pk} '
                f'by user {self.user.username}')
