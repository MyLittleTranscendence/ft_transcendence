import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from backend import settings
from backend.redis import RedisConnection


class DefaultConsumer(AsyncWebsocketConsumer):
    redis = None
    nickname = None
    profile_image = None
    LOGOUT_MESSAGE = "user_logout"

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.handle_duplicate_login()
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
        """
        컨슈머 객체 필드에 유저 정보 저장
        """
        self.nickname = self.scope['user'].nickname
        self.profile_image = f"{settings.BASE_URL}{self.scope['user'].profile_image.url}"
        await self.set_user_info()

    async def set_user_info(self):
        """
        유저 정보를 레디스에 저장
        """
        await self.redis.hset(f"{self.scope['user'].id}_info", mapping={
            "nickname": self.nickname,
            "profile_image": self.profile_image,
        })

    async def handle_duplicate_login(self):
        await self.channel_layer.group_send(
            f"{self.scope['user'].id}_global",
            {
                "type": "user_logout",
                "user_id": self.scope['user'].id,
                "message": "중복 로그인이 감지되어 로그아웃 하였습니다."
            })

    async def user_updated(self, event):
        """
        유저 정보 변경 이벤트 핸들러
        """
        self.nickname = event["nickname"]
        self.profile_image = event["profile_image"]
        await self.set_user_info()

    async def user_logout(self, event):
        """
        disconnect 및 로그아웃 메시지 전송
        """
        user_id = event["user_id"]
        await self.send(text_data=json.dumps({
            "type": self.LOGOUT_MESSAGE,
            "message": event['message']
        }))
        await self.close(code=4001)



