from rest_framework import permissions

from . import models


class IsOwnerPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: models.OrderProduct):
        return request.user == obj.order.user
