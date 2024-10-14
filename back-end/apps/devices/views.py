from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from apps.devices.serializers import PreregisterDeviceSerializer, RegisterDeviceSerializer
from apps.devices.models import Device, UserDevice
from apps.readings.models import Action

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
                        "device_name": user_device.nickname,
                        "reading_interval": user_device.device_id.reading_interval, 
                        "fertilizing_interval": user_device.device_id.fertilizing_interval,
                        "soil_humidity": user_device.device_id.soil_humidity,
                        "sunlight_hours": user_device.device_id.sunlight_hours,
                        "led": user_device.device_id.led,
                        "water_level": user_device.device_id.water_level} for user_device in user_devices   ]
        return Response(device_data, status=200)
    return Response([], status=200) 

@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_device(request, id):
    user = request.user
    try:
        user_device = UserDevice.objects.select_related('device_id').get(user_id=user.id, device_id=id)
        device_data = {
            "id": user_device.device_id.id,
            "device_name": user_device.nickname,
            "reading_interval": user_device.device_id.reading_interval,
            "fertilizing_interval": user_device.device_id.fertilizing_interval,
            "soil_humidity": user_device.device_id.soil_humidity,
            "sunlight_hours": user_device.device_id.sunlight_hours,
            "led": user_device.device_id.led,
            "water_level": user_device.device_id.water_level
        }

        return Response(device_data, status=200)
    
    except UserDevice.DoesNotExist:
        return Response({"message": "Device not found"}, status=404)
    
@api_view(["GET"])
def get_device_esp(request, id):
    try:
        device = Device.objects.get(hash=id)
        #consultar a última fertilização desse device
        # action = get_action(device.id)
        device_data = {
            "reading_interval": device.reading_interval,
            "fertilizing_interval": device.fertilizing_interval,
            "soil_humidity": device.soil_humidity
            # "last_fertilizing": action
        }
        return Response(device_data, status=200)
    
    except Device.DoesNotExist:
        return Response({"message": "Device not found"}, status=404)
    

# def get_action(device_id):
#     action = (
#         Action.objects
#         .filter(device_id=device_id, actuator="fertilizer")
#         .order_by('-created_at')
#         .values('executed_at')
#         .first()
#     )
#     if action is not None:
#         return action['executed_at']
#     else:
#         return None
   
