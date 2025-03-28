# Generated by Django 5.1.6 on 2025-03-08 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('noteapp', '0005_note_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='drawing',
            field=models.ImageField(blank=True, null=True, upload_to='note_drawings/'),
        ),
        migrations.AlterField(
            model_name='note',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='note_images/'),
        ),
    ]
