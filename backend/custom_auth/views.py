from datetime import datetime, timedelta

import pytz
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView

from backend import settings
from custom_auth.oauth_42_constant import Oauth42Constant
from custom_auth.oauth_service import Oauth42Service
from custom_auth.serializers import Oauth42UserPostSerializer, CustomTokenObtainPairSerializer, \
    MFATokenGenerateSerializer
from user.models import User


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
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response(
            {'access': str(refresh.access_token),
             'refresh': str(refresh),
             'mfa_require': refresh['mfa_require']})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MFACodeGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = request.user.update_mfa_code()

        send_mail(
            '트센 2차 인증 메세지',
            f'인증 코드: {user.mfa_code}',
            settings.EMAIL_HOST,
            [user.email],
            fail_silently=False,
        )

        return Response(status=201)


class MFATokenGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        serializer = MFATokenGenerateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.mfa_code_check(serializer.validated_data["mfa_code"])
        refresh = CustomTokenObtainPairSerializer.get_2fa_token(user)
        return Response(
            {'access': str(refresh.access_token),
             'refresh': str(refresh),
             'mfa_require': refresh['mfa_require']})


class MFAEnableView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        serializer = MFATokenGenerateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.update_mfa_enable(serializer.validated_data["mfa_code"])
        refresh = CustomTokenObtainPairSerializer.get_2fa_token(user)
        return Response(
            {'access': str(refresh.access_token),
             'refresh': str(refresh),
             'mfa_require': refresh['mfa_require']})


class MFADisableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.update_mfa_disable()
        return Response(status=201)
