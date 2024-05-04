"""Конфигурационный файл приложения products."""

from django.apps import AppConfig


class ProductsConfig(AppConfig):
    """Конфигурация приложения."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'
    verbose_name = 'products'
