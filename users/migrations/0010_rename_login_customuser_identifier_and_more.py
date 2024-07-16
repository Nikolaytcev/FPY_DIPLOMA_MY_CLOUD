# Generated by Django 4.2.13 on 2024-06-11 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_customuser_login_alter_customuser_path_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='login',
            new_name='identifier',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='path',
            field=models.CharField(default='/<django.db.models.query_utils.DeferredAttribute object at 0x000001DA677A31F0>', max_length=500),
        ),
    ]
