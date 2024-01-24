from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    username = serializers.CharField(required=True, min_length=4, max_length=100)
    email = serializers.EmailField(required=True, max_length=100)
    nickname = serializers.CharField(required=True, min_length=4, max_length=100)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nickname', 'wins', 'losses']


class UserPostSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, min_length=4, max_length=100)

    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + ['password']
