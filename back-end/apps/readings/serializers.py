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
        device = Device.objects.get(id=attrs.get("device_id"))
        #criar o action
        action = Action.objects.create(user_id= user.id, device_id=device, actuator=attrs["actuator"])

        attrs["action_id"] = action.id

        self.change_led(attrs["actuator"], device)
        attrs["actuator"] = self.acting_type(attrs["actuator"])
        attrs["token"] = device.hash



        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            device.hash, attrs
        )
        return True
    
    def acting_type(self, acting):
        if acting == "water":
            return 0
        if acting == "led_on":
            return 1
        if acting == "led_off":
            return 2
        if acting == "fertilizer":
            return 3
    
    def change_led(self, actuator, device):
        if actuator == "led_on":
            device.led = True
            device.save()
        if actuator == "led_off":
            device.led = False
            device.save()
