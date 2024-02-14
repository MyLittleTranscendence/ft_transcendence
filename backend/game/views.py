from django.db.models import Q
from django.shortcuts import render
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
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
            return Game.objects.filter(Q(left_user=user) | Q(right_user=user)).select_related('left_user', 'right_user',
                                                                                              'winner').order_by("-id")
        else:
            return Game.objects.all().select_related('left_user', 'right_user', 'winner').order_by("-id")

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('user_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER)
    ])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
