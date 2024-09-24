from django.db import models
from apps.accounts.models import User
from apps.devices.models import Device

# Create your models here.


class Action(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    device_id = models.ForeignKey(Device, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    actuator = models.CharField(null=False, max_length=31)
    state = models.BooleanField(null=False)
    created_at = models.DateTimeField(null=False, auto_now=True)
    executed_at = models.DateTimeField(null=True, auto_now=False)


class Reading(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    device_id = models.ForeignKey(Device, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    soil_moisture = models.FloatField()
    air_humidity = models.FloatField()
    air_temperature = models.FloatField()
    luminosity = models.FloatField()
    water_level = models.BooleanField()
    created_at = models.DateTimeField(null=False, auto_now=True)
