# Generated by Django 3.2.20 on 2023-10-21 05:43

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_sale'),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Fecha'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sale',
            name='_delivery_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Fecha de entrega'),
        ),
        migrations.AlterField(
            model_name='sale',
            name='_quote',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sale', to='core.quote', verbose_name='Cotización'),
        ),
    ]