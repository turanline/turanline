from django.db import models


class PaymentSystemChoices(models.TextChoices):
    VISA = '1', 'Visa'
    MASTERCARD = '2', 'MasterCard'
