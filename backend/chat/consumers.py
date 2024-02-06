# chat/consumers.py
import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['query_string']
        # await self.close(code=401)
        print(f"Connected user: {self.scope['user']}")
        print(f"Connected user: {self.scope['user']}")
        print(f"Connected user: {self.scope['user']}")
        print(f"Connected user: {self.scope['user']}")
        print(f"Connected user: {self.scope['user']}")

        self.login_group = "login_group"
        await self.channel_layer.group_add(self.login_group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.login_group, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.login_group, {"type": "chat.message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))