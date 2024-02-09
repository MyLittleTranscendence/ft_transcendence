import json

import aioredis
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from backend import settings
from game.message_type import GameMessageType


class GameConsumer(AsyncWebsocketConsumer):
    REDIS_HOST, REDIS_PORT = settings.CHANNEL_LAYERS["default"]["CONFIG"]["hosts"][0]

    async def redis_connection(self):
        self.redis = await aioredis.from_url(f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}", encoding="utf-8",
                                             decode_responses=True)

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(GameMessageType.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()
            await self.redis_connection()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(GameMessageType.LOGIN_GROUP, self.channel_name)
        await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)
        self.redis.close()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

