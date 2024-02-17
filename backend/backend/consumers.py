import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from backend import settings
from backend.redis import RedisConnection


class DefaultConsumer(AsyncWebsocketConsumer):
    redis = None
    nickname = None
    profile_image = None

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(f"{self.scope['user'].id}_global", self.channel_name)
            await self.accept()
            redis_connection = await RedisConnection.get_instance()
            self.redis = redis_connection.redis
            await self.user_info_init()

    async def disconnect(self, close_code):
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.channel_layer.group_discard(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_discard(f"{self.scope['user'].id}_global", self.channel_name)

    async def user_info_init(self):
        self.nickname = self.scope['user'].nickname
        self.profile_image = f"{settings.BASE_URL}{self.scope['user'].profile_image.url}"
        await self.set_user_info()

    async def set_user_info(self):
        await self.redis.hset(f"{self.scope['user'].id}_info", mapping={
            "nickname": self.nickname,
            "profile_image": self.profile_image,
        })

    async def user_updated(self, event):
        self.nickname = event["nickname"]
        self.profile_image = event["profile_image"]
        await self.set_user_info()
