# Generated by Django 5.0.2 on 2024-07-26 14:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0035_productcolor_alter_product_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='amount',
        ),
    ]