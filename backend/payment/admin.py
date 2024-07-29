from django.contrib import admin

from . import models


admin.site.register(models.CardPayment)
admin.site.register(models.Card)
