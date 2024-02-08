from rest_framework import serializers
from .models import User


class UserPatchSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=True, max_length=100)
    nickname = serializers.CharField(required=True, min_length=4, max_length=100)

    class Meta:
        model = User
        fields = ['id', 'email', 'nickname']


class UserGetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nickname = serializers.CharField(required=True, min_length=4, max_length=100)
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    profile_image = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nickname', 'wins', 'losses', 'profile_image']


class UserMyProfileSerializer(UserGetSerializer):
    username = serializers.CharField(required=True, min_length=4, max_length=100)
    email = serializers.EmailField(required=True, max_length=100)
    mfa_enable = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserGetSerializer.Meta.model
        fields = UserGetSerializer.Meta.fields + ['username', 'email', 'mfa_enable']


class UserPostSerializer(UserMyProfileSerializer):
    password = serializers.CharField(write_only=True, min_length=4, max_length=100)

    class Meta:
        model = UserMyProfileSerializer.Meta.model
        fields = UserMyProfileSerializer.Meta.fields + ['password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileImageSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(use_url=True)

    class Meta:
        model = User
        fields = ['id', 'profile_image']


class UserCheckSerializer(serializers.ModelSerializer):
    exists = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ['exists']
