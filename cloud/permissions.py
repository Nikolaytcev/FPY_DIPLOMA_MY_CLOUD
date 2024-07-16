from rest_framework.permissions import BasePermission


class isMyPermissionClass(BasePermission):
    def has_permission(self, request, view):
        user_id = request.GET.get('id')
        return (request.user.is_authenticated and user_id == request.user.id) or request.user.is_staff
