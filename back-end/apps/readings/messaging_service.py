from apps.devices.models import Device
from apps.readings.models import Reading

class DeviceMessageHandler:
    def save_device_message(self, message):
        # Encontra o dispositivo
        print(message.get("token"))
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
        print("Salvo atuação")
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

