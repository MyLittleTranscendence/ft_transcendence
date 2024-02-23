import asyncio
import uuid
from datetime import datetime, timedelta

from channels.db import database_sync_to_async
from channels.layers import get_channel_layer

from backend.redis import RedisConnection
from game.models import Game


class MatchService:
    _instance = None
    _redis = None
    _channel_layer = None

    # GAME_TYPE
    SINGLE_GAME = "single_game"
    MULTI_GAME = "multi_game"
    TOURNAMENT_GAME = "tournament_game"

    # GAME_STATUS
    BEFORE = "before"
    START = "start"
    END = "end"

    # QUEUE_KEY
    MULTIPLAYER_QUEUE_KEY = "multiplayer_queue"
    MULTIPLAYER_QUEUE_SET_KEY = "multiplayer_queue_set"
    TOURNAMENT_QUEUE_KEY = "tournament_queue"
    TOURNAMENT_QUEUE_SET_KEY = "tournament_queue_set"

    # GAME_DEFAULT_SIZE
    SCREEN_WIDTH = 800
    SCREEN_HEIGHT = 600
    BAR_WIDTH = 18
    BAR_HEIGHT = 100
    BAR_CHEAT_HEIGHT = 400
    CIRCLE_RADIUS = 9
    
    # bar_size cheet
    BAR_SIZE_CHEAT = ["sechung is handsome", "jincpark is handsome", "hyeonjun is handsome"]


    def __init__(self):
        raise RuntimeError("Call get_instance() instead")

    @classmethod
    async def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            await cls._instance.initialize()
        return cls._instance

    async def initialize(self):
        self._channel_layer = get_channel_layer()
        redis_connection = await RedisConnection.get_instance()
        self._redis = redis_connection.redis







    # GAME_MATCH, SAVE
    async def start_single_pingpong_game(self, user_id):
        """
        싱글 게임 시작
        """
        if await self.is_penalty(user_id):
            return
        if await self.already_game(user_id):
            return
        asyncio.create_task(self.single_game([user_id]))

    async def join_multi_queue(self, user_id, r_push=True):
        """
        멀티 게임 큐에 참가
        """
        if await self.is_penalty(user_id):
            return
        if await self.already_game(user_id):
            return
        if r_push:
            await self._redis.rpush(self.MULTIPLAYER_QUEUE_KEY, user_id)
        else:
            await self._redis.lpush(self.MULTIPLAYER_QUEUE_KEY, user_id)
        await self._redis.sadd(self.MULTIPLAYER_QUEUE_SET_KEY, str(user_id))

        queue_users_id = await self._redis.lrange(self.MULTIPLAYER_QUEUE_KEY, 0, -1)
        for queue_user_id in queue_users_id:
            await self.handle_queue_update_message(queue_user_id, len(queue_users_id))
        queue_length = await self._redis.llen(self.MULTIPLAYER_QUEUE_KEY)
        if queue_length >= 2:
            user_1 = await self._redis.lpop(self.MULTIPLAYER_QUEUE_KEY)
            user_2 = await self._redis.lpop(self.MULTIPLAYER_QUEUE_KEY)
            await self._redis.srem(self.MULTIPLAYER_QUEUE_SET_KEY, user_1, user_2)
            asyncio.create_task(self.multi_game([user_1, user_2]))

    async def join_tournament_queue(self, user_id, r_push=True):
        """
        토너먼트 게임 큐에 참가
        """
        if await self.is_penalty(user_id):
            return
        if await self.already_game(user_id):
            return
        if r_push:
            await self._redis.rpush(self.TOURNAMENT_QUEUE_KEY, user_id)
        else:
            await self._redis.lpush(self.TOURNAMENT_QUEUE_KEY, user_id)
        await self._redis.sadd(self.TOURNAMENT_QUEUE_SET_KEY, str(user_id))
        queue_users_id = await self._redis.lrange(self.TOURNAMENT_QUEUE_KEY, 0, -1)
        for queue_user_id in queue_users_id:
            await self.handle_queue_update_message(queue_user_id, len(queue_users_id))

        queue_length = await self._redis.llen(self.TOURNAMENT_QUEUE_KEY)
        if queue_length >= 4:
            user_1 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_2 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_3 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_4 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            await self._redis.srem(self.TOURNAMENT_QUEUE_SET_KEY, user_1, user_2, user_3, user_4)
            asyncio.create_task(self.tournament_game([user_1, user_2, user_3, user_4]))

    async def delete_from_queue(self, user_id, queue_key, queue_set_key):
        """
        게임 큐에서 제거
        """
        await self._redis.lrem(queue_key, 1, user_id)
        await self._redis.srem(queue_set_key, user_id)
        queue_users_id = await self._redis.lrange(queue_key, 0, -1)
        for queue_user_id in queue_users_id:
            await self.handle_queue_update_message(queue_user_id, len(queue_users_id))

    async def accept_queue_request(self, users_id: list, game_type):
        """
        매칭된 큐 수락을 요청
        """
        queue_session = str(uuid.uuid4())
        for user_id in users_id:
            await self.handle_accept_queue_request_message(user_id, queue_session)
        await asyncio.sleep(11)

        accept_users = []
        reject_users = []
        for user_id in users_id:
            accept = await self._redis.get(f"user:{user_id}:queue_session:{queue_session}")
            if accept is None:
                reject_users.append(user_id)
            else:
                accept_users.append(user_id)

        if not reject_users:
            for user_id in users_id:
                await self.handle_match_success_message(user_id)
            return True

        for user_id in accept_users:
            await self.handle_match_fail_message(user_id)

        penalty_time = (datetime.now() + timedelta(seconds=60)).strftime('%Y-%m-%d %H:%M:%S')
        for user_id in reject_users:
            await self._redis.set(f"user:{user_id}:penalty", penalty_time)
            await self._redis.expire(f"user:{user_id}:penalty", 60)
        for user_id in reject_users:
            await self.handle_penalty_message(user_id, penalty_time)

        await self.set_users_in_game(users_id, False)

        for user_id in accept_users:
            if game_type == self.MULTI_GAME:
                await self.join_multi_queue(user_id, False)
            elif game_type == self.TOURNAMENT_GAME:
                await self.join_tournament_queue(user_id, False)

        return False

    async def accept_queue_response(self, user_id, text_data_json):
        """
        매칭된 큐 수락
        """
        await self._redis.set(f"user:{user_id}:queue_session:{text_data_json.get('session_id')}", "true")
        await self._redis.expire(f"user:{user_id}:queue_session:{text_data_json.get('session_id')}", 20)

    async def invite_user(self, user_id, text_data_json):
        """
        사용자 게임 초대
        """
        if int(user_id) == int(text_data_json.get('invited_user_id')):
            return
        if await self.is_penalty(user_id):
            return
        if await self.already_game(user_id):
            return
        if await self.already_game(text_data_json.get('invited_user_id')):
            await self.handle_invite_impossible_message(user_id)
            return
        await self._redis.set(f"user:{user_id}:invite", text_data_json.get('invited_user_id'))
        await self._redis.expire(f"user:{user_id}:invite", 10)
        await self.handle_accept_invite_request_message(int(text_data_json.get('invited_user_id')), user_id)

    async def accept_invite(self, user_id, text_data_json):
        """
        게임 초대 수락
        """
        if await self.already_game(user_id):
            return
        if await self.is_penalty(user_id):
            return
        invited_user_id = await self._redis.get(f"user:{text_data_json.get('inviter_user_id')}:invite")
        if (invited_user_id is not None) and (int(user_id) == int(invited_user_id)):
            asyncio.create_task(self.invite_game([int(text_data_json.get('inviter_user_id')), user_id]))

    async def single_game(self, users_id: list):
        """
        싱글 게임 관리
        """
        await self.set_users_in_game(users_id, True)
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[0], self.SINGLE_GAME)
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def multi_game(self, users_id: list):
        """
        멀티 게임 관리
        """
        await self.set_users_in_game(users_id, True)
        if not await self.accept_queue_request(users_id, self.MULTI_GAME):
            return
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[1], self.MULTI_GAME)
        game_info = await self.get_game_info(game_session)
        await self.save_game_result(game_info)
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def tournament_game(self, users_id: list):
        """
        토너먼트 게임 관리
        """
        await self.set_users_in_game(users_id, True)
        if not await self.accept_queue_request(users_id, self.TOURNAMENT_GAME):
            return
        for user_id in users_id:
            await self.handle_tournament_begin_message(user_id, users_id)
        await asyncio.sleep(3)
        await self.handle_next_game_message(users_id[2])
        await self.handle_next_game_message(users_id[3])
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[1], self.TOURNAMENT_GAME, users_id[2], users_id[3])
        game_info = await self.get_game_info(game_session)
        winner1 = game_info.get("winner")
        await self.save_game_result(game_info)
        await self.delete_game_session_logic(users_id, game_session)

        await self.handle_next_game_message(winner1)
        game_session = await self.new_game_session_logic(users_id, users_id[2], users_id[3], self.TOURNAMENT_GAME, winner1)
        game_info = await self.get_game_info(game_session)
        winner2 = game_info.get("winner")
        await self.save_game_result(game_info)
        await self.delete_game_session_logic(users_id, game_session)

        game_session = await self.new_game_session_logic(users_id, winner1, winner2, self.TOURNAMENT_GAME)
        game_info = await self.get_game_info(game_session)
        await self.save_game_result(game_info)
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def invite_game(self, users_id: list):
        """
        초대 게임 관리
        """
        await self.set_users_in_game(users_id, True)
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[1], self.MULTI_GAME)
        game_info = await self.get_game_info(game_session)
        await self.save_game_result(game_info)
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def is_penalty(self, user_id):
        """
        패널티가 존재하는지 확인
        """
        penalty_time = await self._redis.get(f"user:{user_id}:penalty")
        if penalty_time:
            await self.handle_penalty_message(user_id, penalty_time)
            return True
        return False

    async def already_game(self, user_id):
        """
        게임 관련 작업에 참여중인지 확인
        """
        penalty_time = await self._redis.get(f"user:{user_id}:penalty")
        in_game = await self.is_user_in_game(user_id)
        already_multi_queue = await self._redis.sismember(self.MULTIPLAYER_QUEUE_SET_KEY, str(user_id))
        already_tournament_queue = await self._redis.sismember(self.TOURNAMENT_QUEUE_SET_KEY, str(user_id))
        inviter = await self._redis.get(f"user:{user_id}:invite")
        return penalty_time or in_game or already_multi_queue or already_tournament_queue or inviter




    # MATCH_HANDLER
    async def handle_queue_update_message(self, user_id, cnt):
        """
        파싱 및 queue.update 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "queue.update",
                'cnt': cnt
            })

    async def handle_accept_queue_request_message(self, user_id, queue_session):
        """
        파싱 및 accept.queue.request 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "accept.queue.request",
                "session_id": queue_session
            })

    async def handle_match_success_message(self, user_id):
        """
        파싱 및 match.success 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "match.success",
            })

    async def handle_match_fail_message(self, user_id):
        """
        파싱 및 match.fail 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "match.fail",
            })

    async def handle_penalty_message(self, user_id, penalty_time):
        """
        파싱 및 penalty.wait 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "penalty.wait",
                "penalty_time": penalty_time
            })

    async def handle_next_game_message(self, user_id):
        """
        파싱 및 next.game 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "next.game",
                "message": "다음 순서에 게임이 진행됩니다. 준비하세요!"
            })

    async def handle_tournament_begin_message(self, user_id, users_id):
        """
        파싱 및 tournament.begin 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "tournament.begin",
                "game1_left_user_id": int(users_id[0]),
                "game1_right_user_id": int(users_id[1]),
                "game2_left_user_id": int(users_id[2]),
                "game2_right_user_id": int(users_id[3]),
            })

    async def handle_accept_invite_request_message(self, user_id, inviter_user_id):
        """
        파싱 및 accept.invite.request 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "accept.invite.request",
                "inviter_user_id": inviter_user_id
            })

    async def handle_invite_impossible_message(self, user_id):
        """
        파싱 및 invite.impossible 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "invite.impossible",
            })




    # MATCH REDIS
    async def is_user_in_game(self, user_id):
        """
        유저가 게임중인지 확인
        """
        in_game = await self._redis.get(f"user:{user_id}:in_game")
        return in_game == "true"

    async def set_user_in_game(self, user_id, in_game=True):
        """
        유저를 인게임 상태 변경
        """
        await self._redis.set(f"user:{user_id}:in_game", "true" if in_game else "false")

    async def set_users_in_game(self, users_id, true_or_false: bool):
        """
        유저들의 인게임 상태 일괄 변경
        """
        for user_id in users_id:
            await self.set_user_in_game(user_id, true_or_false)

    # MATCH DB
    @database_sync_to_async
    def save_game_result(self, game_info):
        """
        게임 결과 저장
        """
        Game.create_new_game_and_update_score(game_info)


















    # GAME_LOGIC
    async def new_game_session_logic(self, users_id, left_player, right_player, game_type,
                                     next_left_player=None, next_right_player=None):
        """
        새로운 게임 세션을 생성
        """
        game_session = str(uuid.uuid4())
        await self.set_game_info(left_player, right_player, game_type, game_session, next_left_player, next_right_player)
        for user_id in users_id:
            await self.set_user_game_session(user_id, game_session)
            await self.handle_info_message(user_id, game_session)
        await self.game_start(users_id, game_session)
        return game_session

    async def delete_game_session_logic(self, users_id, game_session):
        """
        게임 세션 정보 삭제
        """
        await self.delete_game_info(game_session)
        for user_id in users_id:
            await self.delete_user_game_session(user_id)

    async def move_bar(self, user_id, command):
        """
        유저 패들 움직임 로직 관리
        """
        if not await self.is_user_in_game(user_id):
            return

        game_session = await self.get_user_game_session(user_id)
        if game_session is None:
            return

        game_info = await self.get_game_info(game_session)
        if game_info is None:
            return

        if game_info.get("status") != self.START:
            return

        if game_info.get("game_type") == self.SINGLE_GAME:
            if command in ["U", "D"]:
                await self.update_game_info(game_session, "right_bar_mv", command)
            if command in ["W", "S"]:
                await self.update_game_info(game_session, "left_bar_mv", "U" if command == "W" else "D")
        else:
            if game_info.get("left_user_id") == str(user_id):
                await self.update_game_info(game_session, "left_bar_mv", command)
                await self.bar_size_cheat(game_session, "left_bar_height", command)
            elif game_info.get("right_user_id") == str(user_id):
                await self.update_game_info(game_session, "right_bar_mv", command)
                await self.bar_size_cheat(game_session, "right_bar_height", command)

    async def game_start(self, users_id: list, game_session):
        """
        pingpong 게임 로직
        """
        for i in range(7):
            for user_id in users_id:
                await self.handle_wait_message(user_id, 6 - i)
            await asyncio.sleep(1)

        await self.update_game_info(game_session, "status", self.START)
        for user_id in users_id:
            await self.handle_info_message(user_id, game_session)

        game_info = await self.get_game_info(game_session)
        left_user_id = game_info.get("left_user_id")
        right_user_id = game_info.get("right_user_id")

        left_score = 0
        right_score = 0

        ## 게임판 크기
        screen_width = self.SCREEN_WIDTH
        screen_height = self.SCREEN_HEIGHT

        ## 탁구채 크기 (width, height)
        bar_width = self.BAR_WIDTH
        bar_height = self.BAR_HEIGHT

        ## 탁구채의 시작점 (x,y), 좌측 맨끝 중앙
        bar_x = bar_start_x = 0
        bar_y = bar_start_y = (screen_height - bar_height) / 2

        bar_right_x = bar_right_start_x = screen_width - bar_width
        bar_right_y = (screen_height - bar_height) / 2

        ## 탁구공 크기 (반지름)
        circle_radius = self.CIRCLE_RADIUS
        circle_diameter = circle_radius * 2

        ## 탁구공 시작점 (x, y), 우측 맨끝 중앙
        circle_x = circle_start_x = (screen_width - circle_diameter) / 2  ## 원의 지름 만큼 빼기
        circle_y = circle_start_y = (screen_height - circle_diameter) / 2

        bar_move = 0
        speed_x, speed_y, speed_bar = -screen_width / 2.28, screen_height / 2.92, screen_height * 1.5

        start_time = datetime.now()
        while left_score < 11 and right_score < 11:
            current_time = datetime.now()
            time_passed = current_time - start_time
            time_sec = time_passed.total_seconds()

            circle_x += speed_x * time_sec
            circle_y += speed_y * time_sec
            ai_speed = speed_bar * time_sec

            game_info = await self.get_game_info(game_session)
            if game_info.get("left_bar_mv") == "U":
                bar_move = -ai_speed
            elif game_info.get("left_bar_mv") == "D":
                bar_move = ai_speed
            else:
                bar_move = 0
            await self.update_game_info(game_session, "left_bar_mv", "NONE")
            bar_y += bar_move

            right_bar_mv = game_info.get("right_bar_mv")
            if right_bar_mv == "U":
                bar_move = -ai_speed
            elif right_bar_mv == "D":
                bar_move = ai_speed
            else:
                bar_move = 0
            await self.update_game_info(game_session, "right_bar_mv", "NONE")
            bar_right_y += bar_move
            left_bar_height = int(game_info.get("left_bar_height"))
            right_bar_height = int(game_info.get("right_bar_height"))

            if bar_y >= screen_height - left_bar_height:
                bar_y = screen_height - left_bar_height
            elif bar_y <= 0:
                bar_y = 0

            if bar_right_y >= screen_height - right_bar_height:
                bar_right_y = screen_height - right_bar_height
            elif bar_right_y <= 0:
                bar_right_y = 0

            if circle_x < bar_width:
                if bar_y - circle_radius <= circle_y <= bar_y + left_bar_height + circle_radius:
                    circle_x = bar_width
                    speed_x = -speed_x
                    speed_x *= 1.1
                    speed_y *= 1.1

            if circle_x + circle_radius >= bar_right_x:
                if bar_right_y - circle_radius <= circle_y <= bar_right_y + right_bar_height + circle_radius:
                    circle_x = bar_right_x - circle_diameter
                    speed_x = -speed_x
                    speed_x *= 1.1
                    speed_y *= 1.1

            if circle_x < -circle_radius:  ## bar에 닿지 않고 좌측 벽면에 닿았을 때, 게임 종료 및 초기화
                circle_x, circle_y = circle_start_x, circle_start_y
                bar_x, bar_y = bar_start_x, bar_start_y
                bar_right_x, bar_right_y = bar_right_start_x, bar_start_y
                speed_x, speed_y, speed_bar = -screen_width / 2.28, screen_height / 2.92, screen_height * 1.5
                speed_x = -speed_x
                speed_y = -speed_y
                right_score += 1
                await self.update_game_info(game_session, "right_score", right_score)
                for user_id in users_id:
                    await self.handle_info_message(user_id, game_session)

            if circle_x + circle_radius > screen_width:
                circle_x, circle_y = circle_start_x, circle_start_y
                bar_x, bar_y = bar_start_x, bar_start_y
                bar_right_x, bar_right_y = bar_right_start_x, bar_start_y
                speed_x, speed_y, speed_bar = -screen_width / 2.28, screen_height / 2.92, screen_height * 1.5
                left_score += 1
                await self.update_game_info(game_session, "left_score", left_score)
                for user_id in users_id:
                    await self.handle_info_message(user_id, game_session)

            if circle_y <= 0:  ## 위측 벽면에 닿았을때
                speed_y = -speed_y
                circle_y = 0
            if circle_y >= screen_height - circle_diameter:  ## 아래 벽면에 닿았을때
                speed_y = -speed_y
                circle_y = screen_height - circle_diameter

            for user_id in users_id:
                await self.handle_update_message(user_id, bar_x, bar_y, bar_right_x, bar_right_y, circle_x, circle_y,
                                                 left_bar_height, right_bar_height)
            start_time = current_time
            await asyncio.sleep(1 / 60)  # 1/60초 대기

        await self.update_game_info(game_session, "winner", left_user_id if left_score > right_score else right_user_id)
        await self.update_game_info(game_session, "status", self.END)
        for user_id in users_id:
            await self.handle_info_message(user_id, game_session)




    #HANDLE GAME
    async def handle_update_message(self, user_id, bar_x, bar_y, bar_right_x, bar_right_y, circle_x, circle_y,
                                    left_bar_height, right_bar_height):
        """
        게임 실시간 위치 정보 파싱 및 update.game 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "update.game",
                "bar_x": bar_x,
                "bar_y": bar_y,
                "bar_right_x": bar_right_x,
                "bar_right_y": bar_right_y,
                "circle_x": circle_x,
                "circle_y": circle_y,
                "left_bar_height": left_bar_height,
                "right_bar_height": right_bar_height,
            })

    async def handle_info_message(self, user_id, game_session):
        """
        파싱 및 info.game 이벤트 핸들러 호출
        """
        game_info = await self.get_game_info(game_session)
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "info.game",
                "left_user_id": int(game_info.get("left_user_id")),
                "right_user_id": int(game_info.get("right_user_id")),
                "game_type": game_info.get("game_type"),
                "left_score": game_info.get("left_score"),
                "right_score": game_info.get("right_score"),
                "status": game_info.get("status"),
                "winner": int(game_info.get("winner")),
                "screen_width": self.SCREEN_WIDTH,
                "screen_height": self.SCREEN_HEIGHT,
                "bar_width": self.BAR_WIDTH,
                # "bar_height": self.BAR_HEIGHT,
                "left_bar_height": game_info.get("left_bar_height"),
                "right_bar_height": game_info.get("right_bar_height"),
                "circle_radius": self.CIRCLE_RADIUS,
                "next_left_player": int(game_info.get("next_left_player")),
                "next_right_player": int(game_info.get("next_right_player")),
            })

    async def handle_wait_message(self, user_id, time):
        """
        파싱 및 wait.game 이벤트 핸들러 호출
        """
        await self._channel_layer.group_send(
            str(user_id), {
                "type": "wait.game",
                "time": time,
            })


    # GAME REDIS
    async def bar_size_cheat(self, game_session, key, command):
        if command in self.BAR_SIZE_CHEAT:
            asyncio.create_task(self.bar_size_cheat_logic(game_session, key))

    async def bar_size_cheat_logic(self, game_session, key):
        await self.update_game_info(game_session, key, self.BAR_CHEAT_HEIGHT)
        await asyncio.sleep(7)
        await self.update_game_info(game_session, key, self.BAR_HEIGHT)


    async def set_user_game_session(self, user_id, game_session):
        """
        게임 세션 키를 생성
        """
        await self._redis.set(f"user:{user_id}:game_session", game_session)

    async def delete_user_game_session(self, user_id):
        """
        유저의 게임 세션 정보를 삭제
        """
        await self._redis.delete(f"user:{user_id}:game_session")

    async def get_user_game_session(self, user_id):
        """
        유저의 게임 세션 정보를 가져옴
        """
        return await self._redis.get(f"user:{user_id}:game_session")

    async def update_game_info(self, game_session, key, value):
        """
        게임 세션 정보를 변경
        """
        await self._redis.hset(f"game_info:{game_session}", str(key), str(value))

    async def get_game_info(self, game_session):
        """
        게임 세션 정보를 가져옴
        """
        return await self._redis.hgetall(f"game_info:{game_session}")

    async def delete_game_info(self, game_session):
        """
        게임 세션 정보를 삭제
        """
        await self._redis.delete(f"game_info:{game_session}")

    async def set_game_info(self, left_user_id, right_user_id, game_type, game_session, next_left_player, next_right_player):
        """
        게임 세션 정보를 생성
        """
        await self._redis.hset(f"game_info:{game_session}", mapping={
            "left_user_id": str(left_user_id),
            "right_user_id": str(right_user_id),
            "left_bar_mv": "NONE",
            "right_bar_mv": "NONE",
            "game_type": game_type,
            "left_score": "0",
            "right_score": "0",
            "status": self.BEFORE,
            "winner": "0",
            "next_left_player": str(next_left_player) if next_left_player is not None else "0",
            "next_right_player": str(next_right_player) if next_right_player is not None else "0",
            "bar_width": self.BAR_WIDTH,
            # "bar_height": self.BAR_HEIGHT,
            "left_bar_height": self.BAR_HEIGHT,
            "right_bar_height": self.BAR_HEIGHT,
        })