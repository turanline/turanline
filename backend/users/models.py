from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager
from .enums import NewsCategories, AppealStatus


class User(AbstractUser):

    objects = UserManager()

    is_provider = models.BooleanField(
        'Является ли юзер поставщиком',
        default=False
    )


class News(models.Model):

    image = models.ImageField(
        'Картинка новости',
        upload_to='admin-news-images/',
        null=True,
    )

    category = models.CharField(
        'Категория новости',
        choices=NewsCategories
    )

    title = models.CharField(
        'Заголовок новости',
        max_length=300
    )

    text = models.TextField(
        'Текст новости'
    )

    date = models.DateField(
        'Дата новости',
        auto_now_add=True,
    )

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )


class Appeal(models.Model):
    """Модель обращений поставщиков."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    text = models.TextField(
        'Текст обращения',
    )

    status = models.CharField(
        'Статус обращения',
        choices=AppealStatus
    )

    answer = models.TextField(
        'Ответ на обращение',
        null=True
    )
