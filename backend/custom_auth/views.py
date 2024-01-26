import logging

from django.shortcuts import redirect
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from backend import settings
from custom_auth.oauth_service import Oauth42Service
from custom_auth.serializers import Oauth42UserPostSerializer
from user.serializers import UserPostSerializer


class Login42(APIView):
    permission_classes = [AllowAny]

    authorization_uri = "https://api.intra.42.fr/oauth/authorize"
    client_id = settings.CLIENT_ID_42
    response_type = "code"
    redirect_uri = "http://localhost:8000/api/login/oauth2/code/42api"
    scope = "public"

    def get(self, request, *args, **kwargs):
        http_request = f"{self.authorization_uri}?client_id={self.client_id}&response_type={self.response_type}" \
                       f"&redirect_uri={self.redirect_uri}&scope={self.scope}"
        return redirect(http_request)


class Login42CallBack(APIView):
    permission_classes = [AllowAny]
    oauth_42_service = Oauth42Service()

    def get(self, request, *args, **kwargs):
        access_token = self.oauth_42_service.get_access_token(request)
        oauth_user_info = self.oauth_42_service.get_oauth_user_info(access_token)
        oauth_42_serializer = Oauth42UserPostSerializer(data=oauth_user_info)
        if not oauth_42_serializer.is_valid():
            raise ValidationError("내부 서버 에러, oauth 서비스 이용 불가")
        user = oauth_42_serializer.get_or_create_user(oauth_42_serializer.validated_data)
        result = UserPostSerializer(user)
        return Response({'access_token': access_token,
                         'user': result.data})
