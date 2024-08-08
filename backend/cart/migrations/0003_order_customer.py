# Generated by Django 5.0.2 on 2024-08-08 07:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_order_card'),
        ('customers', '0006_remove_customer_is_verified_alter_customer_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='customer',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, to='customers.customer', verbose_name='Покупатель оформивший заказ'),
            preserve_default=False,
        ),
    ]