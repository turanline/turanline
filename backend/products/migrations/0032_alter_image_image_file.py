# Generated by Django 5.0.2 on 2024-07-24 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0031_alter_image_image_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image_file',
            field=models.ImageField(blank=True, null=True, upload_to='product_images/'),
        ),
    ]