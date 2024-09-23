# Generated by Django 5.0.2 on 2024-09-04 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0005_alter_orderproducts_color_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('CR', 'Created'), ('CT', 'Transferred to Cargo'), ('PR', 'Processed'), ('CD', 'Collected'), ('FD', 'Finished'), ('CL', 'Closed')], default='CR', max_length=50, verbose_name='Статус заказа'),
        ),
    ]