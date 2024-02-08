from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from user.serializers import UserGetSerializer, UserPatchSerializer, UserPostSerializer, UserProfileImageSerializer, \
    UserCheckSerializer, UserMyProfileSerializer
from .models import User


class IsOwnerOrAdminUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and (request.user.is_staff or obj.id == request.user.id)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserGetSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserPostSerializer
        elif self.action == "partial_update":
            return UserPatchSerializer
        return super().get_serializer_class()

    def get_permissions(self):
        permission_classes = []
        if self.action in ["list", "update"]:
            permission_classes = [permissions.IsAdminUser]
        elif self.action in ["partial_update", "destroy"]:
            permission_classes = [IsOwnerOrAdminUser]
        elif self.action == "retrieve":
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class MyProfileGetView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: UserMyProfileSerializer})
    def get(self, request):
        user = request.user
        serializer = UserMyProfileSerializer(user, context={'request': request})
        return Response(serializer.data)


class UserProfileUpdateView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsOwnerOrAdminUser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='profile_image',
                in_=openapi.IN_FORM,
                description='Profile image file',
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={200: UserProfileImageSerializer}
    )
    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserProfileImageSerializer(user, data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)


class UserCheckViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('nickname', openapi.IN_QUERY, description="Nickname to check", type=openapi.TYPE_STRING)
    ],
        responses={200: UserCheckSerializer}
    )
    @action(methods=['get'], detail=False, url_path='nickname', pagination_class=None)
    def nickname_check(self, request):
        nickname = request.query_params.get('nickname')
        exists = User.objects.filter(nickname=nickname).exists()
        serializer = UserCheckSerializer(exists)
        return Response(serializer.data)

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('username', openapi.IN_QUERY, description="Username to check", type=openapi.TYPE_STRING)
    ],
        responses={200: UserCheckSerializer}
    )
    @action(methods=['get'], detail=False, url_path='username', pagination_class=None)
    def username_check(self, request):
        username = request.query_params.get('username')
        exists = User.objects.filter(username=username).exists()
        serializer = UserCheckSerializer(exists)
        return Response(serializer.data)
