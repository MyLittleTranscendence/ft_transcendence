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

        user_id = self.scope['user'].id
        if await self.game_service.is_user_in_game(user_id):
            game_session = await self.game_service.get_user_game_session(user_id)
            await self.game_service.handle_info_message(user_id, game_session)

    async def disconnect(self, close_code):
        await super(GameConsumer, self).disconnect(close_code)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == GameMessageType.SINGLE_GAME_CREATE:
            await self.game_service.start_single_pingpong_game(self.scope['user'].id)
        elif message_type == GameMessageType.MOVE_BAR:
            await self.game_service.move_bar(self.scope['user'].id, text_data_json.get("command"))
        elif message_type == GameMessageType.JOIN_MULTI_GAME_QUEUE:
            await self.game_service.join_multi_queue(self.scope['user'].id)
        elif message_type == GameMessageType.JOIN_TOURNAMENT_GAME_QUEUE:
            await self.game_service.join_tournament_queue(self.scope['user'].id)
        elif message_type == GameMessageType.DELETE_MULTI_GAME_QUEUE:
            await self.game_service.delete_from_queue(self.scope['user'].id,
                                                      GameService.MULTIPLAYER_QUEUE_KEY,
                                                      GameService.MULTIPLAYER_QUEUE_SET_KEY)
        elif message_type == GameMessageType.DELETE_TOURNAMENT_GAME_QUEUE:
            await self.game_service.delete_from_queue(self.scope['user'].id,
                                                      GameService.TOURNAMENT_QUEUE_KEY,
                                                      GameService.TOURNAMENT_QUEUE_SET_KEY)
        elif message_type == GameMessageType.RESPONSE_ACCEPT_QUEUE:
            await self.game_service.accept_queue_response(self.scope['user'].id, text_data_json)

    async def update_game(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.UPDATE_GAME,
            "bar_x": event["bar_x"],
            "bar_y": event["bar_y"],
            "bar_right_x": event["bar_right_x"],
            "bar_right_y": event["bar_right_y"],
            "circle_x": event["circle_x"],
            "circle_y": event["circle_y"],
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
            "bar_width": event["bar_width"],
            "bar_height": event["bar_height"],
            "circle_radius": event["circle_radius"],
            "screen_height": event["screen_height"],
            "screen_width": event["screen_width"],
        }))

    async def wait_game(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.WAIT_GAME,
            "time": event['time'],
        }))

    async def next_game(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.NEXT_GAME,
            "message": event['message'],
        }))

    async def accept_queue_request(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.REQUEST_ACCEPT_QUEUE,
            "session_id": event['session_id'],
        }))

    async def match_success(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.MATCH_SUCCESS,
            "message": "매칭이 성공되었습니다!",
        }))

    async def match_fail(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.MATCH_FAIL,
            "message": "매칭이 실패하였습니다!",
        }))

    async def penalty_wait(self, event):
        await self.send(text_data=json.dumps({
            "type": GameMessageType.PENALTY_WAIT,
            "penalty_time": event['penalty_time'],
        }))
