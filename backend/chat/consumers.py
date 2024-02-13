import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.db.models import Q
from django.utils.timezone import now

from backend.redis import RedisConnection
from block.models import BlockUser
from friend.models import Friend


class ChatConsumer(AsyncWebsocketConsumer):
    LOGIN_GROUP = "login_group"
    TOTAL_MESSAGE = "total_message"
    SINGLE_MESSAGE = "single_message"
    LOGIN_MESSAGE = "login_message"

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()
            redis_connection = await RedisConnection.get_instance()
            self.redis = redis_connection.redis
            await self.redis.set(f"user:{str(self.scope['user'].id)}:online", 1)
            await self.friends_status_message()
            await self.handle_login_status(1)

    async def disconnect(self, close_code):
        await self.redis.delete(f"user:{str(self.scope['user'].id)}:online")
        await self.channel_layer.group_discard(self.LOGIN_GROUP, self.channel_name)
        await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)
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

    async def handle_login_status(self, status):
        user_id = self.scope['user'].id
        relate_users = await database_sync_to_async(list)(Friend.objects.filter(friend_user=user_id)
                                                     .values_list('relate_user_id', flat=True))
        for relater_id in relate_users:
            is_online = await self.redis.exists(f"user:{str(relater_id)}:online")
            if is_online:
                await self.channel_layer.group_send(
                    str(relater_id), {
                        "type": "friend.login",
                        "friends_status": {str(user_id): status}
                    })

    # message
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

    async def friend_login(self, event):
        await self.send(text_data=json.dumps({
            "type": self.LOGIN_MESSAGE,
            "friends_status": event["friends_status"]
        }))

    async def friends_status_message(self):
        user_id = self.scope['user'].id
        friends = await database_sync_to_async(list)(Friend.objects.filter(relate_user_id=user_id)
                                                     .values_list('friend_user_id', flat=True))
        friends_status = {}
        for friend_id in friends:
            is_online = await self.redis.exists(f"user:{str(friend_id)}:online")
            friends_status[str(friend_id)] = is_online
        await self.send(text_data=json.dumps({
            "type": self.LOGIN_MESSAGE,
            "friends_status": friends_status
        }))

    # 차단 당한 유저도 못 보내고 차단한 유저에게도 보낼 수 없다.
    @database_sync_to_async
    def is_blocked(self, sender_id, receiver_id):
        return BlockUser.objects.filter(
            Q(blocker_id=sender_id, blocking_id=receiver_id) |
            Q(blocker_id=receiver_id, blocking_id=sender_id)
        ).exists()
