import json

from django.contrib.auth.models import AnonymousUser

from backend.consumers import DefaultConsumer
from game.message_type import GameMessageType
from game.service import GameService


class GameConsumer(DefaultConsumer):
    game_service = None

    async def connect(self):
        await super(GameConsumer, self).connect()
        if not isinstance(self.scope['user'], AnonymousUser):
            self.game_service = await GameService.get_instance()

    async def disconnect(self, close_code):
        await super(GameConsumer, self).disconnect(close_code)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == GameMessageType.SINGLE_GAME_CREATE:
            await self.game_service.start_single_pingpong_game(self.scope['user'].id)
        if message_type == GameMessageType.MOVE_BAR:
            await self.game_service.move_bar(self.scope['user'].id, text_data_json.get("command"))

    async def update_game(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.UPDATE_GAME,
            "bar_x": event["bar_x"],
            "bar_y": event["bar_y"],
            "bar_right_x": event["bar_right_x"],
            "bar_right_y": event["bar_right_y"],
            "circle_x": event["circle_x"],
            "circle_y": event["circle_y"],
            # "bar_width": event["bar_width"],
            # "bar_height": event["bar_height"],
            # "circle_radius": event["circle_radius"],
            # "screen_height": event["screen_height"],
            # "screen_width": event["screen_width"],
        }))

    async def info_game(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.INFO_GAME,
            "left_user_id": event["left_user_id"],
            "right_user_id": event["right_user_id"],
            "game_type": event["game_type"],
            "left_score": event["left_score"],
            "right_score": event["right_score"],
            "status": event["status"],
            "winner": event["winner"],
        }))
