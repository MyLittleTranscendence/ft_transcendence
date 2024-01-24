from .models import User
from rest_framework import permissions, viewsets

from user.serializers import UserSerializer, UserPostSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserPostSerializer
        return super().get_serializer_class()

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = []
        elif self.action in ["list", "update"]:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
