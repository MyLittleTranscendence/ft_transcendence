from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user_from_jwt(token):
    try:
        decoded_data = AccessToken(token)
        user_id = decoded_data['user_id']
        return get_user_model().objects.get(id=user_id)
    except (InvalidToken, TokenError, get_user_model().DoesNotExist):
        return AnonymousUser()


def get_cookie_header(scope):
    for header in scope['headers']:
        if header[0].decode('utf-8') == 'cookie':
            return header[1].decode('utf-8')
    return ''


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        cookies = get_cookie_header(scope).split(";")
        cookies = list(map(lambda cookie: cookie.strip(), cookies))
        access_tokens = [cookie.split('=', 1)[1] for cookie in cookies if cookie.startswith('access_token=')]
        access_token = access_tokens[0] if access_tokens else None
        if access_token:
            scope['user'] = await get_user_from_jwt(access_token)
        else:
            scope['user'] = AnonymousUser()
        return await self.inner(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
