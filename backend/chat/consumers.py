import json

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db.models import Q
from django.utils.timezone import now

from backend import settings
from backend.consumers import DefaultConsumer
from block.models import BlockUser
from friend.models import Friend


class ChatConsumer(DefaultConsumer):
    TOTAL_MESSAGE = "total_message"
    SINGLE_MESSAGE = "single_message"
    LOGIN_MESSAGE = "login_message"
    LOGIN_GROUP = "chat_login_group"

    async def connect(self):
        await super(ChatConsumer, self).connect()
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.channel_layer.group_add(f"{self.scope['user'].id}chat", self.channel_name)
            await self.redis.set(f"user:{str(self.scope['user'].id)}:online", 1)
            await self.friends_status_message()
            await self.handle_login_status(1)

    async def disconnect(self, close_code):
        await super(ChatConsumer, self).disconnect(close_code)
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.redis.delete(f"user:{str(self.scope['user'].id)}:online")
            await self.handle_login_status(0)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == self.TOTAL_MESSAGE:
            await self.handle_total_message(text_data_json)
        elif message_type == self.SINGLE_MESSAGE:
            await self.handle_single_message(text_data_json)

    # handler
    async def handle_total_message(self, message_data):
        """
        전체 채팅 전송
        """
        message = message_data["message"]
        await self.channel_layer.group_send(
            self.LOGIN_GROUP, {
                "type": "total.message",
                "message": message,
                "sender_id": self.scope['user'].id,
                "sender_nickname": self.scope['user'].nickname,
                "sender_profile_image": f"{settings.BASE_URL}{self.scope['user'].profile_image.url}",
                "datetime": str(now())
            })

    async def handle_single_message(self, message_data):
        """
        개인 채팅 전송, 차단한 유저끼리는 메시지를 보낼 수 없다.
        """
        message = message_data["message"]
        receiver_id = message_data["receiver_id"]
        sender_id = self.scope['user'].id

        if await database_sync_to_async(BlockUser.is_blocked)(sender_id, receiver_id):
            return

        await self.channel_layer.group_send(
            f"{receiver_id}chat", {
                "type": "single.message",
                "message": message,
                "sender_id": self.scope['user'].id,
                "sender_nickname": self.scope['user'].nickname,
                "sender_profile_image": f"{settings.BASE_URL}{self.scope['user'].profile_image.url}",
                "datetime": str(now())
            })

    async def handle_login_status(self, status):
        """
        로그인 상태를 자신을 친구로 등록한 유저들에게 전송
        """
        user_id = self.scope['user'].id
        relate_users = await database_sync_to_async(list)(Friend.objects.filter(friend_user=user_id)
                                                          .values_list('relate_user_id', flat=True))
        for relater_id in relate_users:
            is_online = await self.redis.exists(f"user:{str(relater_id)}:online")
            if is_online:
                await self.channel_layer.group_send(
                    f"{relater_id}chat", {
                        "type": "friend.login",
                        "friends_status": {str(user_id): status}
                    })

    # message
    async def total_message(self, event):
        """
        전체 메시지 전송 이벤트 핸들러
        """
        await self.send(text_data=json.dumps({
            "type": self.TOTAL_MESSAGE,
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_nickname": event["sender_nickname"],
            "sender_profile_image": event["sender_profile_image"],
            "datetime": event["datetime"]
        }))

    async def single_message(self, event):
        """
        단일 메시지 전송 이벤트 핸들러
        """
        await self.send(text_data=json.dumps({
            "type": self.SINGLE_MESSAGE,
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_nickname": event["sender_nickname"],
            "sender_profile_image": event["sender_profile_image"],
            "datetime": event["datetime"]
        }))

    async def friend_login(self, event):
        await self.send(text_data=json.dumps({
            "type": self.LOGIN_MESSAGE,
            "friends_status": event["friends_status"]
        }))

    async def friends_status_message(self):
        """
        친구 목록 전체 로그인 상태 전달
        """
        user_id = self.scope['user'].id
        friends = await database_sync_to_async(list)(
            Friend.objects.filter(relate_user_id=user_id).values_list('friend_user_id', flat=True))
        friends_status = {}
        for friend_id in friends:
            is_online = await self.redis.exists(f"user:{str(friend_id)}:online")
            friends_status[str(friend_id)] = is_online
        await self.send(text_data=json.dumps({
            "type": self.LOGIN_MESSAGE,
            "friends_status": friends_status
        }))