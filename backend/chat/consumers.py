import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.db.models import Q
from django.utils.timezone import now

from block.models import BlockUser


class ChatConsumer(AsyncWebsocketConsumer):
    LOGIN_GROUP = "login_group"
    TOTAL_MESSAGE = "total_message"
    SINGLE_MESSAGE = "single_message"

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close(code=4001)
        else:
            await self.channel_layer.group_add(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, self.LOGIN_GROUP):
            await self.channel_layer.group_discard(self.LOGIN_GROUP, self.channel_name)
            await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)

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
