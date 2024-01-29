from django.shortcuts import redirect
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from custom_auth.oauth_42_constant import Oauth42Constant
from custom_auth.oauth_service import Oauth42Service
from custom_auth.serializers import Oauth42UserPostSerializer
from user.serializers import UserPostSerializer


class Login42(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        http_request = Oauth42Constant.authorization_uri
        return redirect(http_request)


class Login42CallBack(APIView):
    permission_classes = [AllowAny]
    oauth_42_service = Oauth42Service()

    def get(self, request, *args, **kwargs):
        access_token = self.oauth_42_service.get_access_token(request)
        oauth_user_info = self.oauth_42_service.get_oauth_user_info(access_token)
        oauth_42_serializer = Oauth42UserPostSerializer(data=oauth_user_info)
        if not oauth_42_serializer.is_valid():
            return Response(oauth_42_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        user = oauth_42_serializer.get_or_create_user(oauth_42_serializer.validated_data)
        result = UserPostSerializer(user)
        return Response({'access_token': access_token, 'user': result.data})


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['mfa_require'] = user.mfa_enable
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
