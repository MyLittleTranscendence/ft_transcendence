import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from backend.redis import RedisConnection
from game.message_type import GameMessageType
from game.service import GameService


class GameConsumer(AsyncWebsocketConsumer):
    redis = None
    game_service = None

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(GameMessageType.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()
            redis_connection = await RedisConnection.get_instance()
            self.redis = redis_connection.redis
            self.game_service = await GameService.get_instance()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(GameMessageType.LOGIN_GROUP, self.channel_name)
        await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == GameMessageType.SINGLE_GAME_CREATE:
            await self.game_service.start_single_pingpong_game(self.scope['user'].id)

    async def single_game(self, event):
        await self.send(text_data=json.dumps({
            "type": "game_update",
            "bar_x": event["bar_x"],
            "bar_y": event["bar_y"],
            "circle_x": event["circle_x"],
            "circle_y": event["circle_y"],
        }))