# Generated by Django 3.1.4 on 2020-12-26 06:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20201226_1456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webgl_project',
            name='created_time',
            field=models.DateTimeField(),
        ),
    ]