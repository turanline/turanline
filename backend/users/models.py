"""Модуль с логикой пользовательских моделей."""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator
from django.db import models

from products.models import Product


class BankAccountNumber(models.Model):
    """Модель номера банковского счета"""

    number = models.CharField(
        'Номер банковского счета',
        null=False,
        blank=False,
    )


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


class Provider(models.Model):
    """Модель поставщиков."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    country = models.CharField(
        'Страна поставщика',
        max_length=20,
        blank=False,
        null=False
    )

    phone_number = models.CharField(
        'Номер телефона поставшика',
        max_length=20,
        unique=False,
        blank=False,
    )

    company = models.CharField(
        'Название компании',
        max_length=2048,
        null=False,
        blank=False,
    )

    address = models.TextField(
        'Адрес',
        blank=False,
        null=False,
    )

    #   частные лица
    #   10 символов / 11

    taxpayer_identification_number = models.CharField(
        'ИНН или его аналог',
        unique=True
    )

    bank_account_number = models.ForeignKey(
        BankAccountNumber,
        verbose_name='Номера банковских счетов',
        on_delete=models.CASCADE
    )

    PROVIDER_STATES = [
        ('1s', 'First_stage'),
        ('2s', 'Second stage'),
        ('3s', 'Third stage'),
        ('F', 'Finished')
    ]

    state = models.CharField(
        max_length=50,
        choices=PROVIDER_STATES,
        null=False,
        blank=False,
    )

    def __str__(self) -> str:
        return f'Поставщик {self.user.username}'


class Customer(models.Model):
    """Модель пользователя."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )

    favorites = models.ManyToManyField(
        Product,
        blank=True,
    )

    company = models.CharField(
        max_length=2048,
        null=True,
        blank=True,
    )

    address = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return f'Пользователь {self.username}'


class SuperAdminNews(models.Model):

    image = models.ImageField(
        'Картинка новости',
        upload_to='admin-news-images/',
        null=True,
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


class Review(models.Model):
    """Модель отзыва на продукт."""

    text = models.TextField()
    created_datetime = models.DateTimeField(
        auto_now_add=True,
        null=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )

    class Meta:
        """Уникальность пар user - product."""

        unique_together = ('user', 'product')

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Review {self.pk} on {self.product.pk} '
                f'by user {self.user.username}')


class Order(models.Model):
    """Модель объекта включенного в состав заказа."""

    PAYMENT_METHODS = [
        ('BT', 'Bank Transfer'),
        ('BC', 'By card'),
        ('BG', 'By billing'),
        ('CR', 'By cryptocurrency'),
        ('PP', 'By PayPal service'),
    ]

    CREATED = 'CR'
    PROCESSED = 'PR'
    COLLECTED = 'CD'
    FINISHED = 'FD'

    ORDER_STATUSES = [
        (CREATED, 'Created'),
        (PROCESSED, 'Processed'),
        (COLLECTED, 'Collected'),
        (FINISHED, 'Finished'),
    ]

    address = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHODS,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=50,
        choices=ORDER_STATUSES,
        null=True,
        blank=True,
    )

    created_date = models.DateField(
        null=True,
        blank=True,
    )

    total_sum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(
                0,
                message='the total sum cannot be a negative number'
            ),
        ],
        null=True,
        blank=True,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Заказ: {self.pk} состояние '
                f'{self.status} (вледелец: {self.user})')

    class Meta:
        """Сортирует по методам оплаты по убыванию."""

        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-payment_method']


class OrderProduct(models.Model):
    """Модель заказа."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='order_products',
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )

    amount = models.PositiveIntegerField()

    date = models.DateField(
        'Дата заказа',
        auto_now_add=True
    )

    class Meta:
        """Сортирует по количеству."""

        verbose_name = 'Order to Product'
        verbose_name_plural = 'Orders to Products'
        ordering = ['amount']

    def __str__(self) -> str:
        """Строковое представление класса для админ панели."""
        return (f'Товар {self.product} [{self.order}] '
                f'в количестве {self.amount} шт.')


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
