import requests
from rest_framework.exceptions import ValidationError

from custom_auth.oauth_42_constant import Oauth42Constant


class Oauth42Service:
    def get_access_token(self, request):
        code = request.GET.get('code')
        token_request = Oauth42Constant.token_uri + f"&code={code}"
        token_response = requests.post(token_request)
        if not token_response.ok:
            raise ValidationError("내부 서버 에러, 인증 실패")
        return token_response.json().get("access_token")

    def get_oauth_user_info(self, access_token):
        user_info_response = requests.get(self.user_info_uri, params={'access_token': access_token})
        if not user_info_response.ok:
            raise ValidationError("내부 서버 에러, 프로필 조회 실패")
        return user_info_response.json()


