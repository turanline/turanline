"""Модуль ограничений доступа к рессурсам."""

from rest_framework import permissions

from .models import OrderProduct


class IsOwnerOrAdminUserReviewPermission(permissions.BasePermission):
    """Класс разрешения для доступа к обзорам."""

    def has_permission(self, request, view):
        is_admin = bool(request.user and request.user.is_staff)
        if request.method == 'POST':
            try:
                is_owner = request.data['user'] == request.user.pk
                return is_admin or is_owner
            except KeyError:
                return False
        return True

    def has_object_permission(self, request, view, obj) -> bool:
        return (bool(request.user and request.user.is_staff)
                or obj.user == request.user)


class IsOwnerOrAdminCartProductPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        is_admin = bool(request.user and request.user.is_staff)
        is_authenticated = bool(request.user and request.user.is_authenticated)
        return is_admin or is_authenticated

    def has_object_permission(self, request, view, obj: OrderProduct):
        return request.user == obj.order.user


class IsAuthenticatedOrOwnerUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return request.user == obj
