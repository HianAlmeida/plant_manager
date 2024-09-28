from rest_framework.serializers import ModelSerializer
from django.db.models import CharField
from apps.accounts.models import User


class CreateAccountSerializer(ModelSerializer):
    class Meta: 
        model = User 
        fields = ["username", "email", "first_name", "last_name", "password"]
    username = CharField(unique=True, max_length=100)
    password = CharField(max_length=100)
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    email = CharField(max_length=100)
    
    def validate(self, attrs):
        username = attrs.get("username")
        if not User.objects.filter(username=username).exists():
            return self.create(attrs)
        return False
    
    def create(self, validated_data):
        
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data.get("password"))
        user.save()
        return user
