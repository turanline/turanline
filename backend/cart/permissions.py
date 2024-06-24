from rest_framework import permissions

from .models import OrderProduct


class IsOwnerOrAdminCartProductPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        is_admin = bool(request.user and request.user.is_staff)
        is_authenticated = bool(request.user and request.user.is_authenticated)
        return is_admin or is_authenticated

    def has_object_permission(self, request, view, obj: OrderProduct):
        return request.user == obj.order.user