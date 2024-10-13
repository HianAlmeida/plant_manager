from apps.devices.models import Device
from apps.readings.models import Reading, Action
from datetime import datetime
import channels
from asgiref.sync import async_to_sync

class DeviceMessageHandler:
    def save_device_message(self, message):
        print(message)

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
        print("\n\nsalvando mensagem ação")
        if message.get("action_id"): 
            action = Action.objects.get(id=message.get("action_id"))
            if not action.state: 
                action.state = True
                action.executed_at = datetime.now()
                action.save()
        else:
            action = Action.objects.create(
                device_id=device,
                actuator= self.acting_type(message.get("actuator")),
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
        print("\n\n\nele está aquiiiiiii")
        #verifica se é a primeira leitura do dia e se for verifica se é um dia de adubação
        self.logic_fertilizing(device)

        #verifica se é uma leitura acima de 17h se for pega todos as leituras do dia e verifica o tempo em que a luminosidade ficou abaixo do esperado


        #salva o valor da leitura
        message.pop("token")
        message.pop("led")
        message["device_id"] = device
        reading = Reading.objects.create(**message)

        return True
    
    def logic_fertilizing(self, device):
        print("\n\n\nENTRANDO NA LÖGICA DE LAST")
        last_reading = Reading.objects.filter(device_id=device.id).order_by('-created_at').first()
        if last_reading is not None:
            # Obtendo a data atual
            today = datetime.now().date()
            
            # Comparando a data de created_at com a data de hoje
            if last_reading.created_at.date() == today:
                print("Leitura já criada hoje.")
            else:
                action = Action.objects.filter(device_id=device.id, actuator="fertilizer").order_by('-created_at').first()
        
                if action is not None:
                    # Calculando a diferença em meses entre a data da ação e hoje
                    months_difference = (today.year - action.created_at.year) * 12 + today.month - action.created_at.month
                    
                    # Comparando com o intervalo de fertilização do dispositivo
                    if months_difference > device.fertilizing_interval:
                        print("Criando fertilização.")
                        self.send_fertilizing(device)
                    else:
                        print("A diferença de meses está dentro do intervalo de fertilização.")
                else:
                    print("Nenhuma ação encontrada para o dispositivo.")
                    self.send_fertilizing(device)
    
    def logic_led(self,device):
        print("\n\n lógica da luz")
        last_reading = Reading.objects.filter(device_id=device.id).order_by('-created_at').first()
        if last_reading is not None:
            
            # Definindo 17h do dia de hoje
            cutoff_time = datetime.now().replace(hour=17, minute=0, second=0, microsecond=0)
            
            # Verificando se created_at é maior que 17h
            if last_reading.created_at > cutoff_time:
                # Obtendo todas as leituras do dia
                today = datetime.now().date()
                readings_today = Reading.objects.filter(device_id=device.id, created_at__date__day=today)
                
                # Inicializando contador de horas
                minutes_below_threshold = 0
                
                # Loop por todas as leituras do dia
                for reading in readings_today:
                    if reading.luminosity < 30:
                        # Considerando que cada leitura representa um intervalo de tempo
                        minutes_below_threshold += device.reading_interval  
                
                print(f"Quantidade de horas em que luminosidade ficou abaixo de 30: {minutes_below_threshold} horas")
                if minutes_below_threshold > 0:
                    self.send_led_time(device, minutes_below_threshold)
            else:
                print("A última leitura foi criada antes das 17h. Não fazendo nada.")
        else:
            print("Não há leituras disponíveis.")


    def send_fertilizing(self,device):
        action = Action.objects.create(device_id=device, actuator="fertilizer")
        attrs = {}
        attrs["action_id"] = action.id
        attrs["actuator"] = 3
        attrs["token"] = device.hash
        attrs["type"] = "action"
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            device.hash, attrs
        )

    def send_led_time(self,device, time):
        action = Action.objects.create(device_id=device, actuator="fertilizer")
        attrs = {}
        attrs["action_id"] = action.id
        attrs["actuator"] = 1
        attrs["token"] = device.hash
        attrs["type"] = "action"
        attrs["time"] = time
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            device.hash, attrs
        )

    def acting_type(self, acting):
        if acting == 0:
            return "water"
        if acting == 1:
            return "led_on"
        if acting == 2:
            return "led_off"
        if acting == 3:
            return "fertilizer"

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

