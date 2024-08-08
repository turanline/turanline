# Generated by Django 5.0.2 on 2024-08-04 10:45

import django.core.validators
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0038_alter_producttranslation_compound'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(db_index=True, decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0'), message='the price cannot be a negative number')], verbose_name='Цена комплекта'),
        ),
    ]