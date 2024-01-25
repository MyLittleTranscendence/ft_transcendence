from .models import User
from rest_framework import permissions, viewsets

from user.serializers import UserGetSerializer,UserPatchSerializer, UserPostSerializer


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

