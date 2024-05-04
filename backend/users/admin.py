"""Логика для работы с админ панелью приложения users."""

from django.contrib import admin

from .models import Order, OrderProduct, Review, User

admin.site.register(Order)
admin.site.register(OrderProduct)
admin.site.register(User)
admin.site.register(Review)
