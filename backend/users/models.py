from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager
from .enums import NewsCategories, AppealStatus


class User(AbstractUser):

    objects = UserManager()

    is_provider = models.BooleanField(
        default=False
    )


class News(models.Model):

    image = models.ImageField(
        upload_to='admin-news-images/',
        null=True,
        verbose_name='Картинка новости'
    )

    category = models.CharField(
        choices=NewsCategories,
        verbose_name='Категория новости'
    )

    title = models.CharField(
        max_length=300,
        verbose_name='Заголовок новости'
    )

    text = models.TextField(
        verbose_name='Текст новости'
    )

    date = models.DateField(
        auto_now_add=True,
        verbose_name='Дата новости'
    )

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )


class Appeal(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    text = models.TextField(
        verbose_name='Текст обращения'
    )

    status = models.CharField(
        choices=AppealStatus,
        verbose_name='Статус обращения'
    )

    answer = models.TextField(
        null=True,
        verbose_name='Ответ на обращение'
    )
