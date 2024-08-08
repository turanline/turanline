import redis

from django.conf import settings


class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            decode_responses=True
        )

    def add(self, attr: str, value: str, expiration=1200) -> None:
        self.redis.set(
            attr,
            value,
            ex=expiration
        )

    def receive(self, attr: str) -> str:
        return self.redis.get(attr)

    def delete(self, attr: str) -> None:
        self.redis.delete(attr)
