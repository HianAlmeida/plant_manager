from django.shortcuts import render
from rest_framework.decorators import api_view
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from apps.devices.serializers import PreregisterDeviceSerializer

@api_view(["POST"])
def preregister_device(request):
    serializer = PreregisterDeviceSerializer(request.data)
    if serializer.validate(request.data):
        return Response({"message": "Device preregistered"}, status=201)
    return Response({"message": "Device already in database, token updated"}, status=200)
    