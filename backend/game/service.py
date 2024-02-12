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

    async def start_single_pingpong_game(self, user_id):
        if await self.is_user_in_game(user_id):
            print(f"User {user_id}은(는) 이미 게임 중입니다.")
            return
        await self.set_user_in_game(user_id)
        print(f"User {user_id} 게임 시작")
        game_session = str(uuid.uuid4()) # 게임 세션 생성
        await self.set_game_info(user_id, user_id, self.SINGLE_GAME, game_session)# 게임 데이터 넣기
        asyncio.create_task(self.single_game_start([user_id], game_session)) # 게임 돌리기
        # 게임 정리

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

    async def move_bar(self, user_id):
        if not await self.is_user_in_game(user_id):
            print(f"User {user_id}은(는) 게임 중이 아닙니다.")
            return
        asyncio.create_task(self.single_game_start(user_id))

    async def single_game_start(self, users_id: list, game_session):
        ## 게임판 크기
        screen_width = 400
        screen_height = 300

        ## 탁구채 크기 (width, height)
        bar_width = 9
        bar_height = 50

        ## 탁구채의 시작점 (x,y), 좌측 맨끝 중앙
        bar_x = bar_start_x = 0
        bar_y = bar_start_y = (screen_height - bar_height) / 2

        ## 탁구공 크기 (반지름)
        circle_radius = 9
        circle_diameter = circle_radius * 2

        ## 탁구공 시작점 (x, y), 우측 맨끝 중앙
        circle_x = circle_start_x = screen_width - circle_diameter  ## 원의 지름 만큼 빼기
        circle_y = circle_start_y = (screen_width - circle_diameter) / 2

        bar_move = 0
        speed_x, speed_y, speed_bar = -screen_width / 1.28, screen_height / 1.92, screen_height * 1.2

        start_time = datetime.now()
        for _ in range(300):
            current_time = datetime.now()
            time_passed = current_time - start_time
            time_sec = time_passed.total_seconds()

            circle_x += speed_x * time_sec
            circle_y += speed_y * time_sec
            ai_speed = speed_bar * time_sec

            bar_y += bar_move

            if bar_y >= screen_height:
                bar_y = screen_height
            elif bar_y <= 0:
                bar_y = 0

            if circle_x < bar_width:  ## bar에 닿았을 때
                if circle_y >= bar_y - circle_radius and circle_y <= bar_y + bar_height + circle_radius:
                    circle_x = bar_width
                    speed_x = -speed_x
            if circle_x < -circle_radius:  ## bar에 닿지 않고 좌측 벽면에 닿았을 때, 게임 종료 및 초기화
                circle_x, circle_y = circle_start_x, circle_start_y
                bar_x, bar_y = bar_start_x, bar_start_y
            elif circle_x > screen_width - circle_diameter:  ## 우측 벽면에 닿았을 때
                speed_x = -speed_x
            if circle_y <= 0:  ## 위측 벽면에 닿았을때
                speed_y = -speed_y
                circle_y = 0
            elif circle_y >= screen_height - circle_diameter:  ## 아래 벽면에 닿았을때
                speed_y = -speed_y
                circle_y = screen_height - circle_diameter

            for user_id in users_id:
                await self.handle_single_message(user_id, bar_x, bar_y, circle_x, circle_y)
            start_time = current_time
            await asyncio.sleep(1 / 60)  # 1/60초 대기

        # 게임 정보 업데이트 추가 -> 게임의 타입에 따라 결정
        await self._redis.delete(f"game_info:{game_session}")
        for user_id in users_id:
            await self.set_user_in_game(user_id, False)

    async def handle_single_message(self, user_id, bar_x, bar_y, circle_x, circle_y):
        receiver_id = user_id

        await self._channel_layer.group_send(
            str(receiver_id), {
                "type": "single.game",  # 처리할 메시지 타입
                "bar_x": bar_x,
                "bar_y": bar_y,
                "circle_x": circle_x,
                "circle_y": circle_y
            })

    async def is_user_in_game(self, user_id):
        in_game = await self._redis.get(f"user:{user_id}:in_game")
        return in_game == "true"

    async def set_user_in_game(self, user_id, in_game=True):
        await self._redis.set(f"user:{user_id}:in_game", "true" if in_game else "false")
