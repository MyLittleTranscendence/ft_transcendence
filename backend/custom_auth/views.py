import uuid
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.template.defaulttags import now
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import AuthenticationFailed, TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView

from backend import settings
from custom_auth.oauth_42_constant import Oauth42Constant
from custom_auth.oauth_service import Oauth42Service
from custom_auth.serializers import Oauth42UserPostSerializer
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['mfa_require'] = user.mfa_enable
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['mfa_require'] = refresh['mfa_require']
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MFACodeGenerateView(APIView):
    permission_classes = [AllowAny]

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
