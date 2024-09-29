from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from apps.devices.serializers import PreregisterDeviceSerializer, RegisterDeviceSerializer
from apps.devices.models import Device, UserDevice

@api_view(["POST"])
def preregister_device(request):
    serializer = PreregisterDeviceSerializer(request.data)
    if serializer.validate(request.data):
        return Response({"message": "Device preregistered"}, status=201)
    return Response({"message": "Device already in database, token updated"}, status=200)

@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def register_device(request):
    data = request.data
    data["user"] = request.user
    serializer = RegisterDeviceSerializer(data)
    if serializer.validate(data):
        return Response({"message": "Device registered"}, status=200)
    return Response({"message": "Device already registered"}, status=400)

#get dispositivos por usuário
@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_devices(request):
    user = request.user
    print(user.id)
    user_devices = UserDevice.objects.select_related('device_id').filter(user_id=user.id)
    if user_devices.exists():
        device_data = [{"id": user_device.device_id.id, 
                        "reading_interval": user_device.device_id.reading_interval, 
                        "fertilizing_interval": user_device.device_id.fertilizing_interval,
                        "soil_humidity": user_device.device_id.soil_humidity,
                        "sunlight_hours": user_device.device_id.sunlight_hours,
                        "led": user_device.device_id.led,
                        "water_level": user_device.device_id.water_level} for user_device in user_devices   ]
        return Response(device_data, status=200)
    return Response([], status=200) 

#get leituras por dispositivos
   
