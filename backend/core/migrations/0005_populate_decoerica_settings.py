from django.db import migrations

def populate_settings(apps, schema_editor):
    DecoEricaSettings = apps.get_model('core', 'DecoEricaSettings')
    DecoEricaSettings.objects.create(_fabric_surcharge_percentage=75, _installation_price=2000, _sewing_price=8000)

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_decoerica_settings'),
    ]

    operations = [
        migrations.RunPython(populate_settings),
    ]