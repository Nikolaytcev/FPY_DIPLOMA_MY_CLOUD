# Generated by Django 4.2.13 on 2024-06-11 16:20

import cloud.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Files',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to=cloud.models.user_directory_path)),
                ('name', models.CharField(default='', max_length=200)),
                ('size', models.IntegerField(null=True)),
                ('create_date', models.DateTimeField(auto_now=True)),
                ('load_date', models.DateTimeField(null=True)),
                ('comment', models.CharField(default='', max_length=200)),
                ('path', models.CharField(default='', max_length=100)),
                ('link', models.CharField(default='', max_length=300)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
