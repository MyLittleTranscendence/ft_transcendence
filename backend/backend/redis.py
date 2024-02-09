import aioredis

from backend import settings


class RedisConnection:
    _instance = None
    _redis = None

    def __init__(self):
        raise RuntimeError("Call get_instance() instead")

    @classmethod
    async def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            await cls._instance._connect()
        return cls._instance

    async def _connect(self):
        REDIS_HOST, REDIS_PORT = settings.CHANNEL_LAYERS["default"]["CONFIG"]["hosts"][0]
        self._redis = await aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}", encoding="utf-8",
                                              decode_responses=True)

    @property
    def redis(self):
        return self._redis
