from django.db import models
from apps.accounts.models import User

class Device(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    token = models.CharField(max_length=50, null=False)
    hash = models.CharField(max_length=50, null=False)
    reading_interval = models.IntegerField(null=False)
    fertilizing_interval = models.IntegerField(null=False)
    soil_humidity = models.IntegerField(null=False)
    sunlight_hours = models.IntegerField(null=False)
    created_at = models.DateTimeField(null=False, auto_now=True)
    updated_at = models.DateTimeField(null=False, auto_now=True)
    
class UserDevice(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    device_id = models.ForeignKey(Device, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)