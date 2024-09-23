from rest_framework.serializers import ModelSerializer
from django.db.models import CharField

class CreateAccountSerializer(ModelSerializer):
    username = CharField(unique=True, max_length=100)
    password = CharField(unique=True, max_length=100)