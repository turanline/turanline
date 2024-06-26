from django.db import models


class PaymentMethods(models.TextChoices):
    BANK_TRANSFER = 'BT', 'Bank Transfer'
    BY_CARD = 'BC', 'By card'
    BY_BILLING = 'BG', 'By billing'
    BY_CRYPTO = 'CR', 'By cryptocurrency'
    BY_PAYPAL = 'PP', 'By PayPal service'


class OrderStatuses(models.TextChoices):
    CREATED = 'CR', 'Created'
    PROCESSED = 'PR', 'Processed'
    COLLECTED = 'CD', 'Collected'
    FINISHED = 'FD', 'Finished'
