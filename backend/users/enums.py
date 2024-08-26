from django.db import models


class NewsCategories(models.TextChoices):
    POSSIBILITIES = 'F', 'Возможности'
    PARTNERSHIP = 'TP', 'Условия партнерства'
