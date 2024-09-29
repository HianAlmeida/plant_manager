from rest_framework.serializers import ModelSerializer
from apps.devices.models import Device, UserDevice
from apps.accounts.models import User
from apps.readings.models import Reading, Action
import channels
from asgiref.sync import async_to_sync


class SaveActionSerializer(ModelSerializer):
    class Meta: 
        model = Action 
        fields = ["device_id", "user_id", "actuator"]
        
    def validate(self, attrs):
        #find no user
        user = User.objects.get(id=attrs.get("user_id"))
        #find no device
        device = Device.objects.get(hash=attrs.get("device_id"))
        #criar o action
        action = Action.objects.create(user_id= user, device_id=device, actuator=attrs["actuator"])

        attrs["action_id"] = action.id

        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            attrs.get("id"), attrs
        )
        return True
    
    