from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from django.db import transaction

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




