# Generated by Django 5.0.2 on 2024-07-19 08:29

import django.db.models.deletion
import mptt.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_components', '0009_alter_producttype_name'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='productsubtype',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='productsubtype',
            name='type',
        ),
        migrations.AlterUniqueTogether(
            name='producttype',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='producttype',
            name='category',
        ),
        migrations.AlterModelOptions(
            name='category',
            options={'ordering': ['-name'], 'verbose_name': 'Product type', 'verbose_name_plural': 'Product types'},
        ),
        migrations.AddField(
            model_name='category',
            name='image',
            field=models.ImageField(null=True, upload_to='category_images/', verbose_name='Картинка категории'),
        ),
        migrations.AddField(
            model_name='category',
            name='level',
            field=models.PositiveIntegerField(default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='category',
            name='lft',
            field=models.PositiveIntegerField(default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='category',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='product_components.category'),
        ),
        migrations.AddField(
            model_name='category',
            name='rght',
            field=models.PositiveIntegerField(default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='category',
            name='tree_id',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='category',
            unique_together={('name', 'parent')},
        ),
    ]