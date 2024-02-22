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

                    'next_left_player': openapi.Schema(type=openapi.TYPE_INTEGER, description="다음 게임 왼쪽 유저 pk"),
                    'next_right_player': openapi.Schema(type=openapi.TYPE_INTEGER, description="다음 게임 오른쪽 유저 pk"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class UpdateGame(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "참여중인 게임 움직임(바, 공) 위치 정보, 프레임마다 전송, 소수점 존재",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['update_game']),
                    'bar_x': openapi.Schema(type=openapi.TYPE_NUMBER, description="왼쪽 바 중앙 x 좌표"),
                    'bar_y': openapi.Schema(type=openapi.TYPE_NUMBER, description="왼쪽 바 중앙 y 좌표"),
                    'bar_right_x': openapi.Schema(type=openapi.TYPE_NUMBER, description="오른쪽 바 중앙 x 좌표"),
                    'bar_right_y': openapi.Schema(type=openapi.TYPE_NUMBER, description="오른쪽 바 중앙 y 좌표"),
                    'circle_x': openapi.Schema(type=openapi.TYPE_NUMBER, description="공 중앙 x 좌표"),
                    'circle_y': openapi.Schema(type=openapi.TYPE_NUMBER, description="공 중앙 y 좌표"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class WaitGame(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "게임 시작 전 카운트 다운 메시지",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['wait_game']),
                    'time': openapi.Schema(type=openapi.TYPE_INTEGER, description="카운트 다운"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class NextGame(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "다음에 진행되는 게임에 참가됨을 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['next_game']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class RequestAcceptQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "게임이 매칭 후 참가 요청을 보냄 10초 안에 응답해야 참가",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형',
                                           enum=['request_accept_queue']),
                    'session_id': openapi.Schema(type=openapi.TYPE_STRING, description="세션 id"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class MatchSuccess(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "매칭 성공 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['match_success']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class MatchFail(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "매칭 실패 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['match_fail']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class PenaltyWait(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "매칭을 거부한 유저에게 패널티가 부여됬음을 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['penalty_wait']),
                    'penalty_time': openapi.Schema(type=openapi.TYPE_STRING, description="패널티 만료 기간"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class TournamentBegin(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "토너먼트 시작전 유저 정보 전달",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['tournament_begin']),
                    'game1_left_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="첫번째 게임 왼쪽 유저 id"),
                    'game1_right_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="첫번째 게임 왼쪽 유저 id"),
                    'game2_left_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="두번째 게임 왼쪽 유저 id"),
                    'game2_right_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="두번째 게임 왼쪽 유저 id"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class RequestInvite(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "게임 초대에 수락할 것을 요청",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['request_invite']),
                    'inviter_user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="초대자 id"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class InviteImpossible(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "해당 사용자 게임 초대가 불가능함을 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['invite_impossible']),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class InviteUser(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "사용자를 게임에 초대.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['invite_user']),
                'invited_user_id': openapi.Schema(type=openapi.TYPE_STRING, description='초대할 사용자 id'),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class ResponseInvite(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "게임 초대를 수락.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['response_invite']),
                'inviter_user_id': openapi.Schema(type=openapi.TYPE_STRING,
                                                  description='request_invite 에서 전달받은 초대한 사용자 id'),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class UpdateQueue(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "큐 인원수 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['queue_update']),
                    'cnt': openapi.Schema(type=openapi.TYPE_INTEGER, description='큐 참여한 인원수'),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class GameLogout(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/game/ \n"
                              "게임 소켓 로그아웃 알림",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['user_logout']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='로그아웃 이유 메시지'),
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
        """
        유저의 게임 정보 페이지네이션 조회
        """
        return super().get(request, *args, **kwargs)
