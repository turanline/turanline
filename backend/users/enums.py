from django.db import models


class NewsCategories(models.TextChoices):
    POSSIBILITIES = 'F', 'Возможности'
    PARTNERSHIP = 'TP', 'Условия партнерства'


class AppealStatus(models.TextChoices):
    CHECKED = 'C', 'Checked'
    APPROVED = 'A', 'Approved'
    NotApproved = 'NA', 'Not approved'
