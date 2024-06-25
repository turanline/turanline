from django.contrib import admin

from . import models

admin.site.register(models.Color)
admin.site.register(models.Brand)
admin.site.register(models.ProductSubType)
admin.site.register(models.ProductType)
admin.site.register(models.ManufacturerCountry)
admin.site.register(models.Category)
admin.site.register(models.Size)
