from typing import Type

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet

from . import models


class IsCustomerPermission(permissions.BasePermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet],
    ) -> bool:
        return request.user.is_authenticated and hasattr(request.user, 'customer')


class CreateOrIsCustomerPermission(IsCustomerPermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        if view.action == 'create':
            return True
        return super().has_permission(request, view)

    def has_object_permission(
        self,
        request: Request,
        view: Type[GenericViewSet],
        obj: models.Customer
    ) -> bool:
        return request.user == obj.user

