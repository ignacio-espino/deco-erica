# Generated by Django 3.2.20 on 2023-07-16 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20230716_0103'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='_email',
            field=models.EmailField(blank=True, max_length=254, null=True, verbose_name='Email'),
        ),
    ]
