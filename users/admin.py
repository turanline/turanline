from django.contrib import admin
from .models import (
    Order,
    OrderProduct,
    User,
    Review,
)

admin.site.register(Order)
admin.site.register(OrderProduct)
admin.site.register(User)
admin.site.register(Review)
