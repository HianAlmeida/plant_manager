from rest_framework.serializers import ModelSerializer
from django.db.models import CharField
from apps.devices.models import Device, UserDevice
from apps.accounts.models import User


class RegisterDeviceSerializer(ModelSerializer):
    class Meta: 
        model = Device 
        fields = ["token", "reading_interval", "fertilizing_interval", "soil_humidity", "sunlight_hours", "user", "nickname"]
        
    def validate(self, attrs):
        token = attrs.get("token")
        device = Device.objects.filter(token=token)
        if not device.exists():
            return False
        device = device.first()
        user = User.objects.get(username=attrs.get("user").username)
        device.update(**attrs)
        userdevice = UserDevice.objects.get_or_create(user_id=user, device_id=device, nickname=attrs.get("nickname"))
        return True
    
    def create(self, validated_data):
        
        device = Device.objects.create(**validated_data)
        return super().create(validated_data)


class PreregisterDeviceSerializer(ModelSerializer):
    class Meta: 
        model = Device 
        fields = ["token", "hash"]
        
    def validate(self, attrs):
        hash = attrs.get("hash")
        if not Device.objects.filter(hash=hash).exists():
            return super().create(attrs)
    
        device = Device.objects.get(hash=hash)
        device.token = attrs.get("token")
        device.save()
        return False
    
    def create(self, validated_data):
        
        user = Device.objects.create(**validated_data)
        user.save()
        return super().create(validated_data)