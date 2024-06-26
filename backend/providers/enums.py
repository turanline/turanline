from django.db import models


class ProviderStates(models.TextChoices):
    MODERATING = 'M', 'Moderating'
    BLOCKED = 'B', 'Blocked'
    FINISHED = 'F', 'Finished'
    CANCELED = 'C', 'Canceled'
