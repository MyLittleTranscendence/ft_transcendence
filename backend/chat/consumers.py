import json

import aioredis
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.db.models import Q
from django.utils.timezone import now

from backend import settings
from block.models import BlockUser
from friend.models import Friend


class ChatConsumer(AsyncWebsocketConsumer):
    LOGIN_GROUP = "login_group"
    TOTAL_MESSAGE = "total_message"
    SINGLE_MESSAGE = "single_message"
    REDIS_HOST, REDIS_PORT = settings.CHANNEL_LAYERS["default"]["CONFIG"]["hosts"][0]

    async def redis_connection(self):
        self.redis = await aioredis.from_url(f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}", encoding="utf-8",
                                             decode_responses=True)

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()
            await self.redis_connection()
            await self.redis.set(f"user:{str(self.scope['user'].id)}:online", 1)
            await self.send_friend_status()

    async def disconnect(self, close_code):
        await self.redis.delete(f"user:{str(self.scope['user'].id)}:online")
        await self.channel_layer.group_discard(self.LOGIN_GROUP, self.channel_name)
        await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)
        self.redis.close()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == self.TOTAL_MESSAGE:
            await self.handle_total_message(text_data_json)
        elif message_type == self.SINGLE_MESSAGE:
            await self.handle_single_message(text_data_json)

    async def handle_total_message(self, message_data):
        message = message_data["message"]
        await self.channel_layer.group_send(
            self.LOGIN_GROUP, {
                "type": "total.message",
                "message": message,
                "sender_id": self.scope['user'].id,
                "sender_nickname": self.scope['user'].nickname,
                "datetime": str(now())
            })

    async def handle_single_message(self, message_data):
        message = message_data["message"]
        receiver_id = message_data["receiver_id"]
        sender_id = self.scope['user'].id

        if await self.is_blocked(sender_id, receiver_id):
            return

        await self.channel_layer.group_send(
            str(receiver_id), {
                "type": "single.message",
                "message": message,
                "sender_id": self.scope['user'].id,
                "sender_nickname": self.scope['user'].nickname,
                "datetime": str(now())
            })

    async def total_message(self, event):
        await self.send(text_data=json.dumps({
            "type": self.TOTAL_MESSAGE,
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_nickname": event["sender_nickname"],
            "datetime": event["datetime"]
        }))

    async def single_message(self, event):
        await self.send(text_data=json.dumps({
            "type": self.SINGLE_MESSAGE,
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_nickname": event["sender_nickname"],
            "datetime": event["datetime"]
        }))

    # 차단 당한 유저도 못 보내고 차단한 유저에게도 보낼 수 없다.
    @database_sync_to_async
    def is_blocked(self, sender_id, receiver_id):
        return BlockUser.objects.filter(
            Q(blocker_id=sender_id, blocking_id=receiver_id) |
            Q(blocker_id=receiver_id, blocking_id=sender_id)
        ).exists()

    # 친구 상태 반환
    async def send_friend_status(self):
        user_id = self.scope['user'].id
        friends_status = await self.get_friends_status(user_id)
        await self.send(text_data=json.dumps({
            "type": "friend_status",
            "friends_status": friends_status
        }))

    async def get_friends_status(self, user_id):
        friends = await database_sync_to_async(list)(Friend.objects.filter(relate_user_id=user_id)
                                                     .values_list('friend_user_id', flat=True))
        friends_status = {}
        for friend_id in friends:
            is_online = await self.redis.exists(f"user:{str(friend_id)}:online")
            friends_status[str(friend_id)] = is_online
        return friends_status
