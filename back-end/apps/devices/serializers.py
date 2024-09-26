from rest_framework.serializers import ModelSerializer
from django.db.models import CharField
from apps.devices.models import Device


class RegisterDeviceSerializer(ModelSerializer):
    class Meta: 
        model = Device 
        fields = ["token", "reading_interval", "fertilizing_interval", "soil_humidity", "sunlight_hours", "user_id"]
        
    def validate(self, attrs):
        username = attrs.get("username")
        if not Device.objects.filter(username=username).exists():
            return super().create(attrs)
        return False
    
    def create(self, validated_data):
        
        user = Device.objects.create_user(**validated_data)
        user.save()
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