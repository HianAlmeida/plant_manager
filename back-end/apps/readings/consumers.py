import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .messaging_service import DeviceMessageHandler

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        handler = DeviceMessageHandler()
        text_data_json = json.loads(text_data)
        handler.save_device_message(text_data_json)
        # self.send(json.dumps(message))

        # Send message to room group
        # async_to_sync(self.channel_layer.group_send)(
        #     self.room_group_name, {"type": "chat.message", "message": message}
        # )

    # Receive message from room group
    # def chat_message(self, event):
    #     message = event["message"]

    #     # Send message to WebSocket
    #     self.send(text_data=json.dumps({"message": message}))
        
    def action(self, event):    
        message = event
        
        self.send(json.dumps(message))