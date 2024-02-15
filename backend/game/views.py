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


class ResponseAcceptQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "매칭된 큐를 수락.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['response_accept_queue']),
                'session_id': openapi.Schema(type=openapi.TYPE_STRING, description='세션 id'),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class InfoGame(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "참여중인 게임 정보 메시지, 시작 전, 로그인 및 점수가 바뀔 때마다 전송",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['info_game']),
                    'left_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="왼쪽 유저 pk"),
                    'right_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="오른쪽 유저 pk"),
                    'game_type': openapi.Schema(type=openapi.TYPE_STRING, description="게임 타입",
                                                enum=['single_game', 'multi_game', 'tournament_game']),
                    'left_score': openapi.Schema(type=openapi.TYPE_INTEGER, description="왼쪽 유저 스코어"),
                    'right_score': openapi.Schema(type=openapi.TYPE_INTEGER, description="오른쪽 유저 스코어"),
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description="게임 상태",
                                             enum=['before', 'start', 'end']),
                    'winner': openapi.Schema(type=openapi.TYPE_STRING,
                                                  description="우승자, None 이거나 결과 나오면 id 를 string으로 전송"),
                    'bar_width': openapi.Schema(type=openapi.TYPE_INTEGER, description="바 너비"),
                    'bar_height': openapi.Schema(type=openapi.TYPE_INTEGER, description="바 높이"),
                    'circle_radius': openapi.Schema(type=openapi.TYPE_INTEGER, description="공 반지름"),
                    'screen_height': openapi.Schema(type=openapi.TYPE_INTEGER, description="맵 높이"),
                    'screen_width': openapi.Schema(type=openapi.TYPE_INTEGER, description="맵 너비"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
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
