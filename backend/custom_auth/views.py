import threading

from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

import user
from backend import settings
from backend.checkers import serializer_valid_check
from backend.signals import logout_signal
from backend.utils import validate_serializer, set_cookie
from custom_auth.oauth_42_constant import Oauth42Constant
from custom_auth.serializers import Oauth42UserPostSerializer, CustomTokenObtainPairSerializer, \
    MFATokenGenerateSerializer, TokenResponseSerializer, CodeResponseSerializer
from custom_auth.services import EmailService, Oauth42Service


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        로그아웃을 위해 소켓 및 인증 토큰 정리를 수행
        """
        response = Response()
        response.set_cookie('access_token', value='', max_age=0)
        user = request.user
        logout_signal.send(user=user)
        return response


class Login42(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        42 oauth resource owner 인증 페이지로 리다이렉트
        """
        http_request = Oauth42Constant.authorization_uri
        return redirect(http_request)


class Login42CallBack(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        42 oauth authorization code grant
        """
        access_token = Oauth42Service.get_access_token(request)
        oauth_user_info = Oauth42Service.get_oauth_user_info(access_token)
        oauth_42_serializer = Oauth42UserPostSerializer(data=oauth_user_info)
        serializer_valid_check(oauth_42_serializer, True)
        user, is_new_user = oauth_42_serializer.get_or_create_user(oauth_42_serializer.validated_data)
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        redirect_url = f"{settings.OAUTH_FRONT_REDIRECT_URL}" \
                       f"?oauth=true" \
                       f"&mfa_require={str(refresh['mfa_require']).lower()}" \
                       f"&is_new_user={str(is_new_user).lower()}" \
                       f"&user_id={user.id}"
        response = HttpResponseRedirect(redirect_url)
        set_cookie(response, refresh.access_token, "access_token")
        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        request_body=CustomTokenObtainPairSerializer,
        responses={200: TokenResponseSerializer})
    def post(self, request, *args, **kwargs):
        """
        로그인 후 jwt 쿠키로 발급
        """
        super_response = super().post(request, *args, **kwargs)
        if super_response.status_code == status.HTTP_200_OK:
            response = Response(
                {'mfa_require': super_response.data.get('mfa_require', None),
                 'user_id': super_response.data.get('user_id', None)}, status=200)
            set_cookie(response, super_response.data.get('access', None), "access_token")
            return response
        return super_response


class MFACodeGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(
        responses={201: CodeResponseSerializer}
    )
    def post(self, request):
        """
        2fa 코드 발급후 이메일 전송
        """
        user = request.user.update_mfa_code()
        thread = threading.Thread(target=EmailService.send_2fa_mail, args=(user.mfa_code, user.email))
        thread.start()
        return Response({'email': user.email}, status=201)


class MFATokenGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(
        request_body=MFATokenGenerateSerializer,
        responses={
            201: TokenResponseSerializer,
            400: 'Bad Request'
        },
        operation_description="Generates MFA token and sends it via email.",
    )
    def post(self, request):
        """
        2fa jwt 쿠키 발급
        """
        serializer = MFATokenGenerateSerializer(data=request.data, context={'request': request})
        validate_serializer(serializer)
        user = request.user
        user.mfa_code_check(serializer.validated_data["mfa_code"])
        refresh = CustomTokenObtainPairSerializer.get_2fa_token(user)
        response = Response(
            {'mfa_require': refresh['mfa_require'],
             'user_id': user.id}, status=201)
        set_cookie(response, str(refresh.access_token), "access_token")
        return response


class MFAEnableView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(
        request_body=MFATokenGenerateSerializer,
        responses={
            201: TokenResponseSerializer,
            400: 'Bad Request'
        },
        operation_description="Generates MFA token and sends it via email.",
    )
    def post(self, request):
        """
        2fa 활성화
        """
        serializer = MFATokenGenerateSerializer(data=request.data, context={'request': request})
        validate_serializer(serializer)
        user = request.user
        user.update_mfa_enable(serializer.validated_data["mfa_code"])
        refresh = CustomTokenObtainPairSerializer.get_2fa_token(user)
        response = Response(
            {'mfa_require': refresh['mfa_require'],
             'user_id': user.id}, status=201)
        set_cookie(response, str(refresh.access_token), "access_token")
        return response


class MFADisableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        2fa 비활성화
        """
        request.user.update_mfa_disable()
        return Response(status=201)
