from typing import Type

from django.db.models import Model
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet


class IsOwnerPermission(permissions.BasePermission):

    def has_object_permission(
        self,
        request: Request,
        view: Type[GenericViewSet],
        obj: Type[Model]
    ) -> bool:
        return request.user.customer == obj.customer
