"""Модуль с логикой пользовательских моделей."""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password, email=None,
                    first_name=None, last_name=None, is_provider=False,
                    is_superuser=False, is_staff=False):
        if not username or not password:
            raise ValueError('Users must have an username and password')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_provider=is_provider,
            is_superuser=is_superuser,
            is_staff=is_staff
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, email=None):
        user = self.create_user(
            username=username,
            password=password,
            email=email,
            first_name='root',
            last_name='root',
            is_provider=True,
            is_superuser=True,
            is_staff=True
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


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

    NEWS_CATEGORY = [
        ('F', 'Возможности'),
        ('TP', 'Условия партнерства')
    ]

    category = models.CharField(
        'Категория новости',
        choices=NEWS_CATEGORY
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

    APPEAL_STATUS = [
        ('C', 'Checked'),
        ('A', 'Approved'),
        ('NA', 'Not approved')
    ]

    status = models.CharField(
        'Статус обращения',
        choices=APPEAL_STATUS
    )

    answer = models.TextField(
        'Ответ на обращение',
        null=True
    )
