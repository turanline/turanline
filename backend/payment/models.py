from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from . import enums
from customers import models as customer_models


class Card(models.Model):

    number = models.CharField(max_length=16)

    expiration_year = models.CharField(max_length=4)

    expiration_month = models.CharField(max_length=2)

    cvv = models.CharField(max_length=3)

    cardholder_name = models.CharField(max_length=100)

    payment_system = models.CharField(
        choices=enums.PaymentSystemChoices
    )


class Payment(models.Model):

    customer = models.ForeignKey(
        customer_models.Customer,
        on_delete=models.CASCADE,
        related_name='payments'
    )

    limit = models.Q(
        model=Card
    )

    content_type = models.ForeignKey(
        ContentType,
        limit_choices_to=limit,
        on_delete=models.CASCADE
    )

    object_id = models.PositiveIntegerField()

    content_object = GenericForeignKey(
        'content_type',
        'object_id'
    )

    class Meta:
        abstract = True


class CardPayment(Payment):

    comment = models.CharField(
        max_length=100
    )



