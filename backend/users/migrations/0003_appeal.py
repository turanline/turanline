# Generated by Django 5.0.2 on 2024-07-18 11:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_is_provider_delete_appeal'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appeal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Текст обращения')),
                ('status', models.CharField(choices=[('C', 'Checked'), ('A', 'Approved'), ('NA', 'Not approved')], verbose_name='Статус обращения')),
                ('answer', models.TextField(null=True, verbose_name='Ответ на обращение')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]