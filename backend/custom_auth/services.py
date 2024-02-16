import requests
from django.core.mail import send_mail
from rest_framework.exceptions import APIException

from backend import settings
from backend.error_messages import Error
from custom_auth.oauth_42_constant import Oauth42Constant


class Oauth42Service:

    @classmethod
    def get_access_token(cls, request):
        """
        42 oauth access token 가져오기
        """
        code = request.GET.get('code')
        token_request = Oauth42Constant.token_uri + f"&code={code}"
        token_response = requests.post(token_request)
        if not token_response.ok:
            raise APIException(Error.AUTH_FAILED)
        return token_response.json().get("access_token")

    @classmethod
    def get_oauth_user_info(cls, access_token):
        """
        42 oauth user 정보 조회
        """
        user_info_response = requests.get(Oauth42Constant.user_info_uri, params={'access_token': access_token})
        if not user_info_response.ok:
            raise APIException(Error.PROFILE_42_GET_FAILED)
        return user_info_response.json()


class EmailService:
    @classmethod
    def send_2fa_mail(cls, mfa_code, email):
        """
        2fa code 이메일 전송
        """
        send_mail(
            '트센 2차 인증 메세지',
            f'인증 코드: {mfa_code}',
            settings.EMAIL_HOST,
            [email],
            fail_silently=False,
        )
