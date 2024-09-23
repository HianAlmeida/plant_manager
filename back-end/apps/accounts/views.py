from django.shortcuts import render
from django.views import View
from rest_framework.decorators import api_view
from apps.accounts.models import User
from rest_framework.response import Response

# Create your views here.


@api_view(["POST"])
def create_user(request):
    post_data = request.data
    username = post_data.get("username")
    password = post_data.get("password")

    if not User.objects.get(username=username):

        user = User.objects.create_user(username=username, password=password)
        user.save()
        print(user)
        return Response({"message": "User created"}, status=201)
    return Response({"message": "Username already in use"}, status=400)
