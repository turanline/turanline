from django.contrib import admin
from .models import (
    Color,
    Brand,
    ProductSubType,
    ProductType,
    Product,
    ManufacturerCountry,
    Category,
    Size,
)

admin.site.site_header = "MiSEXPRESS Website API Administration"
admin.site.site_title = "MiSEXPRESS Website Admin Portal"
admin.site.index_title = "Welcome to MiSEXPRESS Website Admin Portal"

admin.site.register(Color)
admin.site.register(Brand)
admin.site.register(ProductSubType)
admin.site.register(ProductType)
admin.site.register(Product)
admin.site.register(ManufacturerCountry)
admin.site.register(Category)
admin.site.register(Size)
