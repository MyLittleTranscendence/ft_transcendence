from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from backend import settings
from backend.utils import validate_serializer, set_cookie
from custom_auth.oauth_42_constant import Oauth42Constant
from custom_auth.oauth_service import Oauth42Service
from custom_auth.serializers import Oauth42UserPostSerializer, CustomTokenObtainPairSerializer, \
    MFATokenGenerateSerializer, TokenResponseSerializer


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
        redirect_url = f"http://localhost:3000" \
                       f"?oauth=true" \
                       f"&mfa_require={str(refresh['mfa_require']).lower()}" \
                       f"&user_id={user.id}"
        response = HttpResponseRedirect(redirect_url)
        set_cookie(response, refresh.access_token, "access_token")
        return response


class CookieToResponse:
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        request_body=CustomTokenObtainPairSerializer,
        responses={200: TokenResponseSerializer})
    def post(self, request, *args, **kwargs):
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

    @swagger_auto_schema(
        request_body=MFATokenGenerateSerializer,
        responses={
            201: TokenResponseSerializer,
            400: 'Bad Request'
        },
        operation_description="Generates MFA token and sends it via email.",
    )
    def post(self, request):
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
        request.user.update_mfa_disable()
        return Response(status=201)
