from django.urls import path
from users.views import UserViewSet

urlpatterns = [path('user/', UserViewSet.as_view()),
               path('user/<pk>', UserViewSet.as_view())
               ]
