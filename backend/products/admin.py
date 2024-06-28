from django.contrib import admin

from . import models

admin.site.site_header = 'MiSEXPRESS Website API Administration'
admin.site.site_title = 'MiSEXPRESS Website Admin Portal'
admin.site.index_title = 'Welcome to MiSEXPRESS Website Admin Portal'

admin.site.register(models.Product)
admin.site.register(models.ProductStatusChangeArchive)
