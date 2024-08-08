from django.contrib import admin
from parler.admin import TranslatableAdmin

from . import models


admin.site.register(models.City, TranslatableAdmin)
admin.site.register(models.Tariff, TranslatableAdmin)
admin.site.register(models.Delivery)
