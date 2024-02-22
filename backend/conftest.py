import asyncio
import pytest

from backend.redis import RedisConnection


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


async def clear_redis():
    redis_conn = await RedisConnection.get_instance()
    await redis_conn.redis.flushdb()
