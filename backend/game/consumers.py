import json

from django.contrib.auth.models import AnonymousUser

from backend.consumers import DefaultConsumer
from game.message_type import GameMessageType
from game.service import MatchService


class GameConsumer(DefaultConsumer):
    match_service = None
    LOGIN_GROUP = "game_login_group"
    CONSUMER_GROUP = ""

    async def connect(self):
        await super(GameConsumer, self).connect()
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.channel_layer.group_add(str(self.scope['user'].id), self.channel_name)
            self.match_service = await MatchService.get_instance()
            user_id = self.scope['user'].id
            if await self.match_service.is_user_in_game(user_id):
                game_session = await self.match_service.get_user_game_session(user_id)
                await self.match_service.handle_info_message(user_id, game_session)

    async def disconnect(self, close_code):
        await super(GameConsumer, self).disconnect(close_code)
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.channel_layer.group_discard(str(self.scope['user'].id), self.channel_name)

    async def receive(self, text_data):
        """
        클라이언트 메시지 관리
        """
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == GameMessageType.SINGLE_GAME_CREATE:
            await self.match_service.start_single_pingpong_game(self.scope['user'].id)
        elif message_type == GameMessageType.MOVE_BAR:
            await self.match_service.move_bar(self.scope['user'].id, text_data_json.get("command"))
        elif message_type == GameMessageType.JOIN_MULTI_GAME_QUEUE:
            await self.match_service.join_multi_queue(self.scope['user'].id)
        elif message_type == GameMessageType.JOIN_TOURNAMENT_GAME_QUEUE:
            await self.match_service.join_tournament_queue(self.scope['user'].id)
        elif message_type == GameMessageType.RESPONSE_ACCEPT_QUEUE:
            await self.match_service.accept_queue_response(self.scope['user'].id, text_data_json)
        elif message_type == GameMessageType.INVITE_USER:
            await self.match_service.invite_user(self.scope['user'].id, text_data_json)
        elif message_type == GameMessageType.RESPONSE_INVITE:
            await self.match_service.accept_invite(self.scope['user'].id, text_data_json)
        elif message_type == GameMessageType.DELETE_MULTI_GAME_QUEUE:
            await self.match_service.delete_from_queue(self.scope['user'].id,
                                                       MatchService.MULTIPLAYER_QUEUE_KEY,
                                                       MatchService.MULTIPLAYER_QUEUE_SET_KEY)
        elif message_type == GameMessageType.DELETE_TOURNAMENT_GAME_QUEUE:
            await self.match_service.delete_from_queue(self.scope['user'].id,
                                                       MatchService.TOURNAMENT_QUEUE_KEY,
                                                       MatchService.TOURNAMENT_QUEUE_SET_KEY)

    async def update_game(self, event):
        """
        게임 실시간 위치 정보 전송
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.UPDATE_GAME,
            "bar_x": event["bar_x"],
            "bar_y": event["bar_y"],
            "bar_right_x": event["bar_right_x"],
            "bar_right_y": event["bar_right_y"],
            "circle_x": event["circle_x"],
            "circle_y": event["circle_y"],
            "left_bar_height": event["left_bar_height"],
            "right_bar_height": event["right_bar_height"],
        }))

    async def info_game(self, event):
        """
        게임 정보 전송
        """
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
            # "bar_height": event["bar_height"],
            "left_bar_height": event["left_bar_height"],
            "right_bar_height": event["right_bar_height"],
            "circle_radius": event["circle_radius"],
            "screen_height": event["screen_height"],
            "screen_width": event["screen_width"],
            "next_left_player": event["next_left_player"],
            "next_right_player": event["next_right_player"],
        }))

    async def wait_game(self, event):
        """
        게임 시작 전 카운트 다운 정보 전송
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.WAIT_GAME,
            "time": event['time'],
        }))

    async def next_game(self, event):
        """
        다음 게임에 참여할 예정임을 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.NEXT_GAME,
            "message": event['message'],
        }))

    async def accept_queue_request(self, event):
        """
        매칭된 큐의 수락을 요청
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.REQUEST_ACCEPT_QUEUE,
            "session_id": event['session_id'],
        }))

    async def match_success(self, event):
        """
        매칭이 성공했음을 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.MATCH_SUCCESS,
            "message": "매칭이 성공되었습니다!",
        }))

    async def match_fail(self, event):
        """
        매칭이 실패했음을 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.MATCH_FAIL,
            "message": "매칭이 실패하였습니다!",
        }))

    async def penalty_wait(self, event):
        """
        패널티가 적용중임을 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.PENALTY_WAIT,
            "penalty_time": event['penalty_time'],
        }))

    async def tournament_begin(self, event):
        """
        토너먼트 참여 모든 유저 정보 전송
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.TOURNAMENT_BEGIN,
            "game1_left_user_id": event['game1_left_user_id'],
            "game1_right_user_id": event['game1_right_user_id'],
            "game2_left_user_id": event['game2_left_user_id'],
            "game2_right_user_id": event['game2_right_user_id'],
        }))

    async def accept_invite_request(self, event):
        """
        게임 초대에 수락할 것을 요청
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.REQUEST_INVITE,
            "inviter_user_id": event['inviter_user_id'],
        }))

    async def invite_impossible(self, event):
        """
        사용자 초대 불가능 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.INVITE_IMPOSSIBLE,
        }))

    async def queue_update(self, event):
        """
        큐 인원수 변경 알림
        """
        await self.send(text_data=json.dumps({
            "type": GameMessageType.QUEUE_UPDATE,
            "cnt": event['cnt']
        }))
