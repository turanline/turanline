from django.contrib import admin

from .models import Provider, BankAccountNumber

admin.site.register(Provider)
admin.site.register(BankAccountNumber)