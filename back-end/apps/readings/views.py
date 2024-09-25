import channels
from django.shortcuts import render
from rest_framework.decorators import api_view
from asgiref.sync import async_to_sync
from rest_framework.response import Response


# Create your views here.


@api_view(["POST"])
def actuation(request):
    
    data = request.data
    data["type"] = "action"
    
    channel_layer = channels.layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        data.get("id"), data
    )
    return Response({"message":"Action requested"}, status=200)
