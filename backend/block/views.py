from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from block.models import BlockUser
from block.serializers import BlockedUserSerializer
from user.models import User


class BlockUserPost(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={201: BlockedUserSerializer}
    )
    @transaction.atomic
    def post(self, request, user_id):
        """
        차단할 사용자 등록
        """
        blocker = request.user
        blocking = get_object_or_404(User, pk=user_id)
        block_user = BlockUser.block(blocker, blocking)
        serializer = BlockedUserSerializer(block_user, context={'request': request})
        return Response(serializer.data, status=201)


class BlockUserDelete(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def delete(self, request, user_id, block_id):
        """
        차단 해제
        """
        blocker = request.user
        block_user = get_object_or_404(BlockUser, pk=block_id, blocker=blocker, blocking=user_id)
        block_user.delete()
        return Response(status=204)


class BlockUserListView(ListAPIView):
    """
    자신이 차단한 사용자 조회
    """
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlockUser.objects.filter(blocker=self.request.user)
