import uuid
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
from custom_auth.serializers import Oauth42UserPostSerializer, CustomTokenObtainPairSerializer
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
        token = request.data.get('access')
        if not token:
            raise PermissionDenied('access token require')
        try:
            valid_data = AccessToken(token)
            pk = valid_data['user_id']
            user = User.objects.get(pk=pk)
            code = str(uuid.uuid4())

            user.mfa_code = code
            user.mfa_generate_time = datetime.now()
            user.save(update_fields=['mfa_code', 'mfa_generate_time'])

            send_mail(
                '트센 2차 인증 메세지',
                f'인증 코드: {code}',
                settings.EMAIL_HOST,
                [user.email],
                fail_silently=False,
            )
        except TokenError:
            raise AuthenticationFailed("Access Token Invalid")
        except (TypeError, ValueError, ObjectDoesNotExist):
            raise PermissionDenied('Invalid access token')
        return Response(status=201)


class MFATokenGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        token = request.data.get('access')
        code = request.data.get('code')
        if not token or not code:
            raise PermissionDenied('access token and code require')
        try:
            valid_data = AccessToken(token)
            pk = valid_data['user_id']
            user = User.objects.get(pk=pk)
            if not user.mfa_enable:
                raise PermissionDenied('bad access')
            utc_now = datetime.now(pytz.utc)
            if utc_now - timedelta(minutes=settings.MFA_LIMIT_TIME) > user.mfa_generate_time:
                raise AuthenticationFailed("Code Timeout")
            if user.mfa_code != code:
                raise AuthenticationFailed("Code Invalid")
            refresh = CustomTokenObtainPairSerializer.get_2fa_token(user)
            # refresh = CustomTokenObtainPairSerializer.get_token(user)
            # refresh['mfa_require'] = False
            return Response(
                {'access': str(refresh.access_token),
                 'refresh': str(refresh),
                 'mfa_require': refresh['mfa_require']})

        except TokenError:
            raise AuthenticationFailed("Access Token Invalid")
        except (TypeError, ValueError, ObjectDoesNotExist):
            raise PermissionDenied('Invalid access token')


class MFAEnableView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        token = request.data.get('access')
        code = request.data.get('code')
        if not token or not code:
            raise PermissionDenied('access token and code require')
        try:
            valid_data = AccessToken(token)
            pk = valid_data['user_id']
            user = User.objects.get(pk=pk)
            if user.mfa_enable:
                raise PermissionDenied('bad access')
            utc_now = datetime.now(pytz.utc)
            if utc_now - timedelta(minutes=settings.MFA_LIMIT_TIME) > user.mfa_generate_time:
                raise AuthenticationFailed("Code Timeout")
            if user.mfa_code != code:
                raise AuthenticationFailed("Code Invalid")
            user.mfa_enable = True
            user.save(update_fields=['mfa_enable'])
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            refresh['mfa_require'] = False
            return Response(
                {'access': str(refresh.access_token),
                 'refresh': str(refresh),
                 'mfa_require': refresh['mfa_require']})

        except TokenError:
            raise AuthenticationFailed("Access Token Invalid")
        except (TypeError, ValueError, ObjectDoesNotExist):
            raise PermissionDenied('Invalid access token')


class MFADisableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.mfa_enable:
            raise PermissionDenied('bad access')
        user.mfa_enable = False
        user.save(update_fields=['mfa_enable'])
        return Response(status=201)
