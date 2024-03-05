from django.urls import re_path

from chat.consumers import ChatConsumer as ChatConsumer
from game.consumers import GameConsumer as GameConsumer

ASGI_APPLICATION = "backend.routing.application"

websocket_urlpatterns = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
    re_path(r"ws/game/$", GameConsumer.as_asgi()),
]
