# Generated by Django 5.1.1 on 2024-09-29 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('readings', '0007_alter_action_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='user_id',
            field=models.IntegerField(default=None),
        ),
    ]
