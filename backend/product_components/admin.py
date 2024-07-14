from django.contrib import admin
from parler.admin import TranslatableAdmin

from . import models

admin.site.register(models.Color)
admin.site.register(models.ProductSubType)
admin.site.register(models.ProductType)
admin.site.register(models.ManufacturerCountry)
admin.site.register(models.Category)
admin.site.register(models.Size)
admin.site.register(models.Brand)
