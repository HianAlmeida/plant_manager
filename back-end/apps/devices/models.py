from django.db import models
from apps.accounts.models import User

class Device(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    token = models.CharField(max_length=50, null=True)
    hash = models.CharField(max_length=50, null=False)
    reading_interval = models.IntegerField(default=10)
    fertilizing_interval = models.IntegerField(default=1)
    soil_humidity = models.IntegerField(default=50)
    sunlight_hours = models.IntegerField(default=4)
    created_at = models.DateTimeField(null=False, auto_now=True)
    updated_at = models.DateTimeField(null=False, auto_now=True)
    
    def update(self, reading_interval, fertilizing_interval, soil_humidity, sunlight_hours, *args, **kwargs):
        self.reading_interval = reading_interval
        self.fertilizing_interval = fertilizing_interval
        self.soil_humidity = soil_humidity
        self.sunlight_hours = sunlight_hours
        self.token = None
        self.save()
    
class UserDevice(models.Model):
    id = models.AutoField(unique=True, primary_key=True)
    device_id = models.ForeignKey(Device, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)