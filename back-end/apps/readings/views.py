import channels
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.readings.serializers import SaveActionSerializer
from apps.readings.models import Reading, Action


# Create your views here.


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def actuation(request):
    
    data = request.data
    data["type"] = "action"
    data["user_id"] = request.user.id
    #salvar a atuação e passar o id dela para o evento
    serializer = SaveActionSerializer(data)
    if serializer.validate(data):
        return Response({"message": "Action requested"}, status=200)
    return Response({"message": "Bad request"}, status=400)

@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_readings(request, id):
    readings = Reading.objects.filter(device_id=id).order_by('-created_at')[:10]
    if readings.exists():
        # Formata os dados para retorno
        readings_data = [
            {
                'id': reading.id,
                'soil_moisture': round(reading.soil_moisture, 2), 
                'air_humidity': round(reading.air_humidity, 2),     
                'air_temperature': round(reading.air_temperature, 2),
                'luminosity': round(reading.luminosity, 2),         
                'water_level': reading.water_level,
                'created_at': reading.created_at.isoformat(),  # Converte para string ISO
            }
            for reading in readings
        ]
        readings_data = readings_data[::-1]

        # Retorna os dados em formato JSON
        return Response(readings_data, status=200)
    return Response([], status=200)


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_actuation(request, id):
    acting = Action.objects.filter(device_id=id).order_by('-created_at')[:10]
    if acting.exists():
        # Formata os dados para retorno
        action_data = [
            {
                'id': action.id,
                'actuator': action.actuator,
                'state': action.state,
                'created_at': action.created_at.isoformat(),
                'executed_at': action.executed_at
            }
            for action in acting
        ]
        # Retorna os dados em formato JSON
        return Response(action_data, status=200)
    return Response([], status=200)