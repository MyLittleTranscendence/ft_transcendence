import asyncio

import pytest
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from rest_framework_simplejwt.tokens import RefreshToken

from backend import settings
from backend.asgi import application
from conftest import clear_redis
from user.models import User


@database_sync_to_async
def create_test_user_and_token():
    user = User.objects.create_user(username="testuser", password="testpassword", email="wjdtmdjcf@dd.com",
                                    nickname="middle")
    refresh = RefreshToken.for_user(user)
    return user, refresh


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_success_with_valid_token():
    clear_redis()
    try:
        user, refresh = await create_test_user_and_token()
        refresh['mfa_require'] = False
        access_token_bytes = bytes("access_token=" + str(refresh.access_token), 'utf-8')
        url = bytes(settings.BASE_URL, 'utf-8')
        headers = [(b'origin', url), (b'cookie', access_token_bytes)]
        communicator = WebsocketCommunicator(application, 'ws/game/', headers)
        connected, subprotocol = await communicator.connect()
        assert connected
    finally:
        await communicator.disconnect()
    clear_redis()



@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_fail_with_2fa_required_token():
    clear_redis()
    user, refresh = await create_test_user_and_token()
    refresh['mfa_require'] = True
    access_token_bytes = bytes("access_token=" + str(refresh.access_token), 'utf-8')
    url = bytes(settings.BASE_URL, 'utf-8')
    headers = [(b'origin', url), (b'cookie', access_token_bytes)]
    communicator = WebsocketCommunicator(application, 'ws/game/', headers)
    connected, subprotocol = await communicator.connect()
    assert not connected
    await communicator.disconnect()
    clear_redis()


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_fail_with_anonymous_user():
    clear_redis()
    url = bytes(settings.BASE_URL, 'utf-8')
    headers = [(b'origin', url)]
    communicator = WebsocketCommunicator(application, 'ws/game/', headers)
    connected, subprotocol = await communicator.connect()
    assert not connected
    await communicator.disconnect()
    clear_redis()