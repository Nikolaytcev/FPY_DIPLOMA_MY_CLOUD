"""
URL configuration for my_cloud project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import debug_toolbar
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from cloud.views import CloudViewSet, ShareViewSet, download_file_view
from users.views import RegViewSet, UserViewSet


def index_view(request):
    return render(request, 'dist/index.html')


r = DefaultRouter()
r.register('api/register', RegViewSet, basename='register')
r.register('api/users', UserViewSet, basename='user')
r.register('api/files', CloudViewSet, basename='files')
r.register('api/share', ShareViewSet, basename='share')

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/', include("cloud.urls")),
                  path('api/', include("users.urls")),
                  path('', index_view, name='index'),
                  path('<str:download>', download_file_view, name='download'),
                  path('__debug__/', include(debug_toolbar.urls)),
              ] + r.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
