"""Логика для работы с админ панелью приложения users."""

from django.contrib import admin

from .models import User, Appeal, News


admin.site.register(User)
admin.site.register(Appeal)
admin.site.register(News)
