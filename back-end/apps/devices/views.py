from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from apps.devices.serializers import PreregisterDeviceSerializer, RegisterDeviceSerializer

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