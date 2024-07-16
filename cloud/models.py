from django.contrib.auth.models import User
from django.db import models

from users.models import CustomUser


def user_directory_path(instance, filename):
    return f'{instance.user.username}/{filename}'


class Files(models.Model):
    file = models.FileField(upload_to=user_directory_path, null=True, blank=True)
    name = models.CharField(max_length=100, default='')
    size = models.CharField(max_length=30, default='')
    create_date = models.DateTimeField(auto_now=False)
    load_date = models.DateTimeField(null=True)
    comment = models.CharField(max_length=200, default='')
    path = models.CharField(max_length=50, default='')
    link = models.CharField(max_length=200, default='')
    encode_link = models.CharField(max_length=200, default='')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='files', null=True)
