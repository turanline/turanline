from django.contrib.auth.models import AbstractUser
from django.db import models

from . import enums, managers


class User(AbstractUser):

    objects = managers.UserManager()

    phone_number = models.CharField(
        max_length=16,
        unique=True,
        verbose_name='Номер телефона'
    )

    is_customer = models.BooleanField(
        default=False,
        verbose_name='Является клиентом'
    )

    is_provider = models.BooleanField(
        default=False,
        verbose_name='Является провайдером'
    )

    is_verified = models.BooleanField(
        default=False,
        verbose_name='Проверен'
    )

    USERNAME_FIELD = 'phone_number'

    REQUIRED_FIELDS = [
        'email',
        'password'
    ]

    def save(self, *args, **kwargs):
        self.username = self.email.split('@')[0]
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self) -> str:
        return f'{self.username} ({self.phone_number[-4:]})'


class News(models.Model):

    image = models.ImageField(
        upload_to='admin-news-images/',
        null=True,
        verbose_name='Картинка новости'
    )

    category = models.CharField(
        choices=enums.NewsCategories,
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
        verbose_name='Автор'
    )

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

    def __str__(self) -> str:
        return f'{self.title} ({self.date})'
