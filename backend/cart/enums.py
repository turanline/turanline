from django.db import models


class OrderStatuses(models.TextChoices):
    CREATED = 'CR', 'Created'
    ON_PAYMENT = 'ON_PAYMENT', 'On payment'
    CARGO_TRANSFERRED = 'CT', 'Transferred to Cargo'
    PROCESSED = 'PR', 'Processed'
    COLLECTED = 'CD', 'Collected'
    FINISHED = 'FD', 'Finished'
    CLOSED = 'CL', 'Closed'
