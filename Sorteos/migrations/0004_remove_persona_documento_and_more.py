# Generated by Django 5.1.4 on 2024-12-28 22:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Sorteos', '0003_persona_remove_item_descripcion_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='persona',
            name='documento',
        ),
        migrations.RemoveField(
            model_name='persona',
            name='fecha_registro',
        ),
    ]
