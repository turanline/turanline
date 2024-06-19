"""Логика для работы с админ панелью приложения users."""

from django.contrib import admin

from .models import (Order, OrderProduct,
                     Review, User, Appeal,
                     Provider, Customer, SuperAdminNews)

admin.site.register(Order)
admin.site.register(OrderProduct)
admin.site.register(User)
admin.site.register(Review)
admin.site.register(Appeal)
admin.site.register(Provider)
admin.site.register(Customer)
admin.site.register(SuperAdminNews)
