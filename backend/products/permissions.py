from rest_framework import permissions


class OwnerOnly(permissions.IsAdminUser):

    def has_object_permission(self, request, view, obj):
        return obj.provider.user == request.user
