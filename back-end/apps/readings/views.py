import channels
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.readings.serializers import SaveActionSerializer


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