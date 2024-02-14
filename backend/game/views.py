from django.db.models import Q
from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from game.models import Game
from game.serializers import GameListSerializer
from user.models import User


def single_game(request):
    return render(request, "game/single_game.html")


def multi_game(request):
    return render(request, "game/multi_game.html")


def tournament_game(request):
    return render(request, "game/tournament_game.html")


class GameListView(ListAPIView):
    serializer_class = GameListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            user = User.objects.get(pk=user_id)
            return Game.objects.filter(Q(left_user=user) | Q(right_user=user)).order_by("-id")
        else:
            return Game.objects.all().order_by("id").order_by("-id")

