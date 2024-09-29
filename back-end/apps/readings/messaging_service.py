from apps.devices.models import Device
from apps.readings.models import Reading, Action
from datetime import datetime

class DeviceMessageHandler:
    def save_device_message(self, message):
        # Encontra o dispositivo
        try: 
            device = Device.objects.get(hash=message.get("token"))
            # Verifica tipo de mensagem (salvamento de leitura ou de atuação feita)
            if message.get("type") == 'action':
                self.save_acting_message(message, device)
            else: 
                self.save_reading_message(message, device)
        except Device.DoesNotExist:
            print("Dispositivo não encontrado.")
            return False

    def save_acting_message(self, message, device):
        #se o acting_id não existir cria uma nova atuação para o device, se existir apenas atualiza a data e o status
        if message.get("action_id"): 
            action = Action.objects.get(id=message.get("action_id"))
            if not action.state: 
                action.state = True
                action.executed_at = datetime.now()
                action.save()
        else:
            action = Action.objects.create(
                device_id=device,
                actuator=message.get("actuator"),
                state=True,
                created_at=datetime.now(),
                executed_at=datetime.now()
                )

        return True
        
    def save_reading_message(self, message, device):
        #atualizar o valor do water_level e led do device
        device.water_level = message["water_level"]
        device.led = message["led"]
        device.save()

        #salva o valor da leitura
        message.pop("token")
        message.pop("led")
        message["device_id"] = device
        reading = Reading.objects.create(**message)

        return True
    
#modelo mensagem de leitura
# {
#     "water_level": false,
#     "led": true,
#     "token": "12345",
#     "soil_moisture": 11,
#     "air_humidity": 91,
#     "air_temperature": 29,
#     "luminosity": 20,
#     "water_level": false
# }

