"""Логика для работы с админ панелью приложения products."""

from django.contrib import admin

from .models import Product

admin.site.site_header = 'MiSEXPRESS Website API Administration'
admin.site.site_title = 'MiSEXPRESS Website Admin Portal'
admin.site.index_title = 'Welcome to MiSEXPRESS Website Admin Portal'

admin.site.register(Product)
