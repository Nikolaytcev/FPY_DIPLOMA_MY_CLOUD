from django.urls import path

from cloud.views import cloud_view, delete_file_view, change_file_view

urlpatterns = [path('add-file', cloud_view),
               path('delete-file', delete_file_view),
               path('change-file', change_file_view)
               ]
