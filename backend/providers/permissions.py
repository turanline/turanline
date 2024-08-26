from typing import Type

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet


class IsProviderPermission(permissions.BasePermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        return request.user.is_authenticated and hasattr(request.user, 'provider')


class IsProviderOrReadOnlyPermission(IsProviderPermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)


class CreateOrIsProviderPermission(IsProviderPermission):

    def has_permission(
        self,
        request: Request,
        view: Type[GenericViewSet]
    ) -> bool:
        if view.action == 'create':
            return True
        return super().has_permission(request, view)
