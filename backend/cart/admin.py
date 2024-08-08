from django.contrib import admin

from . import models


admin.site.register(models.OrderProducts)
admin.site.register(models.Cart)
admin.site.register(models.Order)
