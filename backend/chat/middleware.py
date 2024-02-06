from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user_from_jwt(token):
    try:
        # JWT 토큰 검증
        decoded_data = AccessToken(token)
        user_id = decoded_data['user_id']
        return get_user_model().objects.get(id=user_id)
    except (InvalidToken, TokenError, get_user_model().DoesNotExist):
        return AnonymousUser()


class JWTAuthMiddleware:
    """
    Custom JWT authentication middleware for Django Channels
    """
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # 쿠키에서 JWT 토큰 추출
        cookies = scope.get('cookies', {})
        access_token = cookies.get('access_token')

        print(f"Connected user: {access_token}")
        print(f"Connected user: {access_token}")
        print(f"Connected user: {access_token}")
        print(f"Connected user: {access_token}")
        print(f"Connected user: {access_token}")


        if access_token:
            scope['user'] = await get_user_from_jwt(access_token)
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)


# 미들웨어 스택에 사용자 정의 미들웨어 포함
def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))