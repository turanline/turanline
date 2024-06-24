from django.contrib import admin

from .models import (Brand, Category, Color, ManufacturerCountry,
                     ProductSubType, ProductType, Size)

admin.site.register(Color)
admin.site.register(Brand)
admin.site.register(ProductSubType)
admin.site.register(ProductType)
admin.site.register(ManufacturerCountry)
admin.site.register(Category)
admin.site.register(Size)
