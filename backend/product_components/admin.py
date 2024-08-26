from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from mptt.forms import MPTTAdminForm
from parler.admin import TranslatableAdmin, TranslatableModelForm

from . import models


class CategoryAdminForm(MPTTAdminForm, TranslatableModelForm):
    pass


class CategoryAdmin(TranslatableAdmin, MPTTModelAdmin):
    form = CategoryAdminForm


admin.site.register(models.Size)
admin.site.register(models.Color, TranslatableAdmin)
admin.site.register(models.ManufacturerCountry, TranslatableAdmin)
admin.site.register(models.Category, CategoryAdmin)
