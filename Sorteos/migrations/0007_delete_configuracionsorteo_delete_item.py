# Generated by Django 5.1.4 on 2025-03-09 22:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Sorteos', '0006_remove_persona_presente'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ConfiguracionSorteo',
        ),
        migrations.DeleteModel(
            name='Item',
        ),
    ]
