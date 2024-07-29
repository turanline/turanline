from django.contrib import admin
from parler.admin import TranslatableAdmin

from . import models

admin.site.site_header = 'MiSEXPRESS Website API Administration'
admin.site.site_title = 'MiSEXPRESS Website Admin Portal'
admin.site.index_title = 'Welcome to MiSEXPRESS Website Admin Portal'

admin.site.register(models.Product, TranslatableAdmin)
admin.site.register(models.ProductStatusChangeArchive)
admin.site.register(models.Image)
admin.site.register(models.ProductSize)
admin.site.register(models.ProductColor)
