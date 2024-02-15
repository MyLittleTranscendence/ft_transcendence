from django.db.models import Q
from django.shortcuts import render
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from requests import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from game.models import Game
from game.serializers import GameListSerializer
from user.models import User


def single_game(request):
    return render(request, "game/single_game.html")


def multi_game(request):
    return render(request, "game/multi_game.html")


def tournament_game(request):
    return render(request, "game/tournament_game.html")


class SingleGameCreate(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "싱글 게임 생성",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['single_game_create']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class MoveBar(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "바 움직임 요청을 전송. cli의 경우도 해당 api로 요청\n"
                              "싱글게임: W, S, U, D\n"
                              "멀티 게임: U, D",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['move_bar']),
                'command': openapi.Schema(type=openapi.TYPE_STRING, description='움직임 유형', enum=['W', 'S', 'U', 'D']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class JoinMultiGameQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "멀티 게임 큐에 참가",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['join_multi_game_queue']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class JoinTournamentGameQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "토너먼트 게임 큐에 참가",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형',
                                       enum=['join_tournament_game_queue']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class DeleteMultiGameQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "멀티 게임 큐 취소",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형',
                                       enum=['delete_multi_game_queue']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class DeleteTournamentGameQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "토너먼트 게임 큐 취소",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형',
                                       enum=['delete_tournament_game_queue']),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})

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
