import json

import pytest
from channels.testing import WebsocketCommunicator

from backend import settings
from backend.asgi import application
from conftest import clear_redis
from game.message_type import GameMessageType
from tests.test_socket_aute_middleware import create_test_user_and_token


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_single_game():
    await clear_redis()
    user, refresh = await create_test_user_and_token()
    refresh['mfa_require'] = False
    access_token_bytes = bytes("access_token=" + str(refresh.access_token), 'utf-8')
    url = bytes(settings.BASE_URL, 'utf-8')
    headers = [(b'origin', url), (b'cookie', access_token_bytes)]
    communicator = WebsocketCommunicator(application, 'ws/game/', headers)
    connected, _ = await communicator.connect()
    assert connected, "Failed to connect to websocket"
    await communicator.send_to(json.dumps({"type": GameMessageType.SINGLE_GAME_CREATE}))
    try:
        while True:
            response = await communicator.receive_from(timeout=10)
            print(response)
            data = json.loads(response)
            if data["type"] == GameMessageType.INFO_GAME and data["status"] == "end":
                assert int(data["left_score"]) == 11 or int(
                    data["right_score"]) == 11, "Game did not end with a score of 11 for one player"
                break
    finally:
        await communicator.disconnect()
        await clear_redis()
