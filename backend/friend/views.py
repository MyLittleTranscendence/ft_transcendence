from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from friend.models import Friend
from friend.serializers import FriendSerializer
from user.models import User


class FriendPostView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={201: FriendSerializer}
    )
    @transaction.atomic
    def post(self, request, user_id):
        relate_user = request.user
        friend_user = get_object_or_404(User, pk=user_id)
        friend = Friend.add_friend(relate_user, friend_user)
        serializer = FriendSerializer(friend, context={'request': request})
        return Response(serializer.data, status=201)


class FriendDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def delete(self, request, user_id, friend_id):
        relate_user = request.user
        friend = get_object_or_404(Friend, pk=friend_id, relate_user=relate_user, friend_user=user_id)
        friend.delete()
        return Response(status=204)


class FriendListView(ListAPIView):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friend.objects.filter(relate_user=self.request.user)
