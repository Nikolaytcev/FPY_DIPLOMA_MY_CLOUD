from django.urls import path
from users.views import login_view, logout_view, delete_view, admin_status_view, whoami_view

urlpatterns = [path('login', login_view),
               path('logout', logout_view),
               path('delete', delete_view),
               path('staff-status', admin_status_view),
               path('session', whoami_view)
               ]
