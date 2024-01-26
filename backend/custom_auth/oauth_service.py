import requests
from rest_framework.exceptions import ValidationError

from backend import settings


class Oauth42Service:
    token_uri = "https://api.intra.42.fr/oauth/token"
    user_info_uri = "https://api.intra.42.fr/v2/me"
    client_id = settings.CLIENT_ID_42
    client_secret = settings.CLIENT_SECRET_42
    grant_type = "authorization_code"
    redirect_uri = "http://localhost:8000/api/login/oauth2/code/42api"
    state = "random_string"

    def get_access_token(self, request):
        code = request.GET.get('code')
        token_request = f"{self.token_uri}?client_id={self.client_id}&client_secret={self.client_secret}&code={code}" \
                        f"&grant_type={self.grant_type}&redirect_uri={self.redirect_uri}&state={self.state}"
        token_response = requests.post(token_request)
        if not token_response.ok:
            raise ValidationError("내부 서버 에러, 인증 실패")
        return token_response.json().get("access_token")

    def get_oauth_user_info(self, access_token):
        user_info_response = requests.get(self.user_info_uri, params={'access_token': access_token})
        if not user_info_response.ok:
            raise ValidationError("내부 서버 에러, 프로필 조회 실패")
        return user_info_response.json()


