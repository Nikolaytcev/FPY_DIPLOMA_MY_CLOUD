# Generated by Django 4.2.13 on 2024-07-11 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cloud', '0005_alter_files_create_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='files',
            name='encode_link',
            field=models.CharField(default='', max_length=200),
        ),
    ]
