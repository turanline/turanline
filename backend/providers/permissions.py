from typing import Type

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet

from products import models as product_models


class IsProviderPermission(permissions.BasePermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        return (
            request.user.is_authenticated
            and request.user.is_verified
            and request.user.is_provider
        )


class IsProviderOrReadOnlyPermission(IsProviderPermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)

    def has_object_permission(
        self,
        request: Request,
        view: Type[GenericViewSet],
        obj: product_models.Product
    ) -> bool:
        return (
            request.method in permissions.SAFE_METHODS
            or obj.provider == request.user.provider
        )


class CreateOrIsProviderPermission(IsProviderPermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        if view.action == 'create':
            return True
        return super().has_permission(request, view)
