from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from backend.redis import RedisConnection
from game.message_type import GameMessageType


class DefaultConsumer(AsyncWebsocketConsumer):
    redis = None

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(GameMessageType.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()
            redis_connection = await RedisConnection.get_instance()
            self.redis = redis_connection.redis

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(GameMessageType.LOGIN_GROUP, self.channel_name)
        await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)
