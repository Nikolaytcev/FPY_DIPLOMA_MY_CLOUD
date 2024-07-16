from rest_framework.permissions import BasePermission


class IsMyAuthenticated(BasePermission):
    def has_permission(self, request, view):
        print(request.user)
        return request.user.is_authenticated()
