from django.shortcuts import render
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from requests import Response
from rest_framework.views import APIView


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


class TotalMessage(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/chat/ \n"
                              "전체 채팅 메시지 수신",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['total_message']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지 내용"),
                    'sender_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="발신자 ID"),
                    'sender_nickname': openapi.Schema(type=openapi.TYPE_STRING, description="발신자 닉네임"),
                    'datetime': openapi.Schema(type=openapi.TYPE_STRING, description="시간"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})

    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/chat/ \n"
                              "전체 채팅 메시지 전송",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['total_message']),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지 내용"),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class SingleMessage(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/chat/ \n"
                              "개인 채팅 메시지 수신",
        responses={
            200: openapi.Response('수신할 데이터', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['single_message']),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지 내용"),
                    'sender_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="발신자 ID"),
                    'sender_nickname': openapi.Schema(type=openapi.TYPE_STRING, description="발신자 닉네임"),
                    'datetime': openapi.Schema(type=openapi.TYPE_STRING, description="시간"),
                }
            )),
        })
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})

    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/chat/ \n"
                              "개인 채팅 메시지 전송",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['single_message']),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description="메시지 내용"),
                'receiver_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="수신자 ID"),
            },
        ),
        responses={
            200: openapi.Response(description="성공"),
        }
    )
    def post(self, request, *args, **kwargs):
        return Response({"message": "Success"})


class LoginMessage(APIView):
    @swagger_auto_schema(
        operation_description="ws://localhost:8000/ws/chat/ \n"
                              "친구의 온라인 상태 메시지 수신.",
        responses={
            200: openapi.Response(
                description='수신할 데이터',
                examples={
                    "application/json": {
                        "type": "login_message",
                        "friends_status": {"1": 1, "3": 0}
                    }
                },
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description='메시지 유형', enum=['friend_status']),
                    'friends_status': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        additional_properties=openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description="친구의 온라인 상태 (true: 온라인, false: 오프라인)",
                        ),
                        description="친구 ID를 키로 하고, 해당 친구의 온라인 상태를 값으로 하는 객체"
                    ),
                },
            )),
        }
    )
    def get(self, request, *args, **kwargs):
        return Response({"message": "Success"})
