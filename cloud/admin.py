from django.contrib import admin

from .models import Files


@admin.register(Files)
class FilesAdmin(admin.ModelAdmin):
    list_display = ['id', 'file', 'name', 'size', 'user']
    list_filter = ['id', 'file', 'user']
