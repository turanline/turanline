# Generated by Django 5.0.2 on 2024-08-08 11:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0006_remove_customer_is_verified_alter_customer_user'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='review',
            options={'ordering': ['-created_datetime'], 'verbose_name': 'Review', 'verbose_name_plural': 'Reviews'},
        ),
    ]