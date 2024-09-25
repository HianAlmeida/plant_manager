from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.accounts.serializers import CreateAccountSerializer


# Create your views here.


@api_view(["POST"])
def create_user(request):
    serializer = CreateAccountSerializer(request.data)
    if serializer.validate(request.data):
        return Response({"message": "User created"}, status=201)
    return Response({"message": "Username already in use"}, status=400)
