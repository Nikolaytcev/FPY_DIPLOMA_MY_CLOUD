# Generated by Django 4.2.13 on 2024-06-27 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0028_alter_customuser_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='path',
            field=models.CharField(default='/<django.db.models.query_utils.DeferredAttribute object at 0x00000123DBA953A0>', max_length=500),
        ),
    ]
