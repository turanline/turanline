# Generated by Django 5.0.2 on 2024-08-30 14:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0003_rename_created_wallet_created_datetime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wallet',
            name='upcoming_balance',
        ),
    ]