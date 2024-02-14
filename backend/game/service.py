import asyncio
import uuid
from datetime import datetime

from channels.layers import get_channel_layer

from backend.redis import RedisConnection


class GameService:
    _instance = None
    _redis = None
    _channel_layer = None

    SINGLE_GAME = "single_game"
    MULTI_GAME = "multi_game"
    TOURNAMENT_GAME = "tournament_game"

    BEFORE = "before"
    START = "start"
    END = "end"

    MULTIPLAYER_QUEUE_KEY = "multiplayer_queue"
    MULTIPLAYER_QUEUE_SET_KEY = "multiplayer_queue_set"
    TOURNAMENT_QUEUE_KEY = "tournament_queue"
    TOURNAMENT_QUEUE_SET_KEY = "tournament_queue_set"

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

    async def move_bar(self, user_id, command):
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
            elif game_info.get("right_user_id") == str(user_id):
                await self.update_game_info(game_session, "right_bar_mv", command)

    async def start_single_pingpong_game(self, user_id):
        if await self.already_game(user_id):
            return
        asyncio.create_task(self.single_game([user_id]))

    async def multi_queue(self, user_id):
        if await self.already_game(user_id):
            return
        await self._redis.rpush(self.MULTIPLAYER_QUEUE_KEY, user_id)
        await self._redis.sadd(self.MULTIPLAYER_QUEUE_SET_KEY, str(user_id))
        queue_length = await self._redis.llen(self.MULTIPLAYER_QUEUE_KEY)
        if queue_length >= 2:
            user_1 = await self._redis.lpop(self.MULTIPLAYER_QUEUE_KEY)
            user_2 = await self._redis.lpop(self.MULTIPLAYER_QUEUE_KEY)
            await self._redis.srem(self.MULTIPLAYER_QUEUE_SET_KEY, user_1, user_2)
            asyncio.create_task(self.multi_game([user_1, user_2]))

    async def tournament_queue(self, user_id):
        if await self.already_game(user_id):
            return
        await self._redis.rpush(self.TOURNAMENT_QUEUE_KEY, user_id)
        await self._redis.sadd(self.TOURNAMENT_QUEUE_SET_KEY, str(user_id))
        queue_length = await self._redis.llen(self.TOURNAMENT_QUEUE_KEY)
        if queue_length >= 4:
            user_1 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_2 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_3 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            user_4 = await self._redis.lpop(self.TOURNAMENT_QUEUE_KEY)
            await self._redis.srem(self.TOURNAMENT_QUEUE_SET_KEY, user_1, user_2, user_3, user_4)
            asyncio.create_task(self.tournament_game([user_1, user_2, user_3, user_4]))

    async def single_game(self, users_id: list):
        await self.set_users_in_game(users_id, True)
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[0], self.SINGLE_GAME)
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def multi_game(self, users_id: list):
        await self.set_users_in_game(users_id, True)
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[1], self.MULTI_GAME)
        # 게임 결과 저장
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def tournament_game(self, users_id: list):
        await self.set_users_in_game(users_id, True)

        await self.handle_next_game_message(users_id[2])
        await self.handle_next_game_message(users_id[3])
        game_session = await self.new_game_session_logic(users_id, users_id[0], users_id[1], self.TOURNAMENT_GAME)
        game_info = await self.get_game_info(game_session)
        winner1 = game_info.get("winner")
        # 게임 결과 저장
        await self.delete_game_session_logic(users_id, game_session)

        await self.handle_next_game_message(winner1)
        game_session = await self.new_game_session_logic(users_id, users_id[2], users_id[3], self.TOURNAMENT_GAME)
        game_info = await self.get_game_info(game_session)
        winner2 = game_info.get("winner")
        # 게임 결과 저장
        await self.delete_game_session_logic(users_id, game_session)

        game_session = await self.new_game_session_logic(users_id, winner1, winner2, self.TOURNAMENT_GAME)
        game_info = await self.get_game_info(game_session)
        # 게임 결과 저장
        await self.delete_game_session_logic(users_id, game_session)
        await self.set_users_in_game(users_id, False)

    async def new_game_session_logic(self, users_id, left_player, right_player, game_type):
        game_session = str(uuid.uuid4())
        await self.set_game_info(left_player, right_player, game_type, game_session)
        for user_id in users_id:
            await self.set_user_game_session(user_id, game_session)
            await self.handle_info_message(user_id, game_session)
        await self.game_start(users_id, game_session)
        return game_session

    async def delete_game_session_logic(self, users_id, game_session):
        await self.delete_game_info(game_session)
        for user_id in users_id:
            await self.delete_user_game_session(user_id)

    async def already_game(self, user_id):
        in_game = await self.is_user_in_game(user_id)
        already_multi_queue = await self._redis.sismember(self.MULTIPLAYER_QUEUE_SET_KEY, str(user_id))
        already_tournament_queue = await self._redis.sismember(self.TOURNAMENT_QUEUE_SET_KEY, str(user_id))
        return in_game or already_multi_queue or already_tournament_queue

    async def is_user_in_game(self, user_id):
        in_game = await self._redis.get(f"user:{user_id}:in_game")
        return in_game == "true"

    async def set_user_in_game(self, user_id, in_game=True):
        await self._redis.set(f"user:{user_id}:in_game", "true" if in_game else "false")

    async def set_users_in_game(self, users_id, true_or_false: bool):
        for user_id in users_id:
            await self.set_user_in_game(user_id, true_or_false)

    async def set_user_game_session(self, user_id, game_session):
        await self._redis.set(f"user:{user_id}:game_session", game_session)

    async def delete_user_game_session(self, user_id):
        await self._redis.delete(f"user:{user_id}:game_session")

    async def get_user_game_session(self, user_id):
        return await self._redis.get(f"user:{user_id}:game_session")

    async def update_game_info(self, game_session, key, value):
        await self._redis.hset(f"game_info:{game_session}", str(key), str(value))

    async def get_game_info(self, game_session):
        return await self._redis.hgetall(f"game_info:{game_session}")

    async def delete_game_info(self, game_session):
        await self._redis.delete(f"game_info:{game_session}")

    async def set_game_info(self, left_user_id, right_user_id, game_type, game_session):
        await self._redis.hset(f"game_info:{game_session}", mapping={
            "left_user_id": str(left_user_id),
            "right_user_id": str(right_user_id),
            "left_bar_mv": "NONE",
            "right_bar_mv": "NONE",
            "game_type": game_type,
            "left_score": "0",
            "right_score": "0",
            "status": self.BEFORE,
            "winner": "NONE"
        })

    async def handle_update_message(self, user_id, bar_x, bar_y, bar_right_x, bar_right_y, circle_x, circle_y,
                                    bar_width, bar_height, circle_radius, screen_height, screen_width):

        await self._channel_layer.group_send(
            str(user_id), {
                "type": "update.game",  # 처리할 메시지 타입
                "bar_x": bar_x,
                "bar_y": bar_y,
                "bar_right_x": bar_right_x,
                "bar_right_y": bar_right_y,
                "circle_x": circle_x,
                "circle_y": circle_y,
                # "bar_width": bar_width,
                # "bar_height": bar_height,
                # "circle_radius": circle_radius,
                # "screen_height": screen_height,
                # "screen_width": screen_width,
            })

    async def handle_info_message(self, user_id, game_session):
        game_info = await self.get_game_info(game_session)

        await self._channel_layer.group_send(
            str(user_id), {
                "type": "info.game",
                "left_user_id": game_info.get("left_user_id"),
                "right_user_id": game_info.get("right_user_id"),
                "game_type": game_info.get("game_type"),
                "left_score": game_info.get("left_score"),
                "right_score": game_info.get("right_score"),
                "status": game_info.get("status"),
                "winner": game_info.get("winner"),
            })

    async def handle_wait_message(self, user_id, time):

        await self._channel_layer.group_send(
            str(user_id), {
                "type": "wait.game",
                "time": time,
            })

    async def handle_next_game_message(self, user_id):

        await self._channel_layer.group_send(
            str(user_id), {
                "type": "next.game",
                "message": "다음 순서에 게임이 진행됩니다. 준비하세요!"
            })

    async def game_start(self, users_id: list, game_session):
        for i in range(7):
            for user_id in users_id:
                await self.handle_wait_message(user_id, 6 - i)
            await asyncio.sleep(1)

        await self.update_game_info(game_session, "status", self.START)

        game_info = await self.get_game_info(game_session)
        left_user_id = game_info.get("left_user_id")
        right_user_id = game_info.get("right_user_id")

        left_score = 0
        right_score = 0

        ## 게임판 크기
        screen_width = 800
        screen_height = 600

        ## 탁구채 크기 (width, height)
        bar_width = 18
        bar_height = 100

        ## 탁구채의 시작점 (x,y), 좌측 맨끝 중앙
        bar_x = bar_start_x = 0
        bar_y = bar_start_y = (screen_height - bar_height) / 2

        bar_right_x = bar_right_start_x = screen_width - bar_width
        bar_right_y = (screen_height - bar_height) / 2

        ## 탁구공 크기 (반지름)
        circle_radius = 9
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

            if bar_y >= screen_height - bar_height:
                bar_y = screen_height - bar_height
            elif bar_y <= 0:
                bar_y = 0

            if bar_right_y >= screen_height - bar_height:
                bar_right_y = screen_height - bar_height
            elif bar_right_y <= 0:
                bar_right_y = 0

            if circle_x < bar_width:
                if bar_y - circle_radius <= circle_y <= bar_y + bar_height + circle_radius:
                    circle_x = bar_width
                    speed_x = -speed_x
                    speed_x *= 1.1
                    speed_y *= 1.1

            if circle_x + circle_radius >= bar_right_x:
                if bar_right_y - circle_radius <= circle_y <= bar_right_y + bar_height + circle_radius:
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
                                                 bar_width, bar_height, circle_radius, screen_height, screen_width)
            start_time = current_time
            await asyncio.sleep(1 / 60)  # 1/60초 대기

        await self.update_game_info(game_session, "winner", left_user_id if left_score > right_score else right_user_id)
        await self.update_game_info(game_session, "status", self.END)
        for user_id in users_id:
            await self.handle_info_message(user_id, game_session)
