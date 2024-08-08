from rest_framework import permissions


class IsOwnerOrAdminUserReviewPermission(permissions.BasePermission):

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