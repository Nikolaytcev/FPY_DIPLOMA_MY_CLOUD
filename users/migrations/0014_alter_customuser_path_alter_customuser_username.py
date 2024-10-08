# Generated by Django 4.2.13 on 2024-06-11 17:28

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_customuser_path_alter_customuser_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='path',
            field=models.CharField(default='/<django.db.models.query_utils.DeferredAttribute object at 0x000001582AEA41F0>', max_length=500),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(error_messages={'Ваш логин не удовлетворяет требованиям:логин — только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов'}, max_length=20, unique=True, validators=[django.core.validators.RegexValidator(code='no match', regex='^[a-zA-z]([a-zA-Z]|[0-9]){3,20}$')], verbose_name='username'),
        ),
    ]
