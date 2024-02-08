from rest_framework import serializers
from .models import User


class UserPatchSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=True, max_length=100)
    nickname = serializers.CharField(required=True, min_length=4, max_length=100)

    class Meta:
        model = User
        fields = ['id', 'email', 'nickname']


class UserGetSerializer(UserPatchSerializer):
    username = serializers.CharField(required=True, min_length=4, max_length=100)
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    profile_image = serializers.ImageField(read_only=True)

    class Meta:
        model = UserPatchSerializer.Meta.model
        fields = UserPatchSerializer.Meta.fields + ['username', 'wins', 'losses', 'profile_image']


class UserMyProfileSerializer(UserGetSerializer):
    mfa_enable = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserGetSerializer.Meta.model
        fields = UserGetSerializer.Meta.fields + ['mfa_enable']


class UserPostSerializer(UserGetSerializer):
    password = serializers.CharField(write_only=True, min_length=4, max_length=100)

    class Meta:
        model = UserGetSerializer.Meta.model
        fields = UserGetSerializer.Meta.fields + ['password']

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
