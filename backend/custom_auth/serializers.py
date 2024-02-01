from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers, viewsets
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from custom_auth.models import Oauth42User
from user.models import User


class Oauth42UserPostSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, max_length=100)
    login = serializers.CharField(required=True, max_length=30)

    class Meta:
        model = Oauth42User
        fields = ['login', 'email']

    @transaction.atomic
    def get_or_create_user(self, validated_data):
        login = validated_data.get("login")
        email = validated_data.get("email")
        try:
            oauth_42_user = Oauth42User.objects.select_related('user').get(login=login)
            return oauth_42_user.user
        except ObjectDoesNotExist:
            user = User.objects.create_oauth_user(email)
            Oauth42User.objects.create(login=login, user=user)
            return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['mfa_require'] = user.mfa_enable
        return token

    @classmethod
    def get_2fa_token(cls, user):
        token = super().get_token(user)
        token['mfa_require'] = False
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['mfa_require'] = refresh['mfa_require']
        return data


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    mfa_require = serializers.BooleanField(read_only=True)


class MFATokenGenerateSerializer(serializers.ModelSerializer):
    mfa_code = serializers.CharField(max_length=100, required=True, write_only=True)

    class Meta:
        model = User
        fields = ['mfa_code']
