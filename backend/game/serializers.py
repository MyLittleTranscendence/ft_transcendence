from game.models import Game
from user.serializers import UserGameSerializer
from rest_framework import serializers


class GameListSerializer(serializers.ModelSerializer):
    left_user = UserGameSerializer(read_only=True)
    right_user = UserGameSerializer(read_only=True)
    winner = UserGameSerializer(read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'game_type', 'left_score', 'right_score', 'created_at', 'left_user', 'right_user', 'winner']
