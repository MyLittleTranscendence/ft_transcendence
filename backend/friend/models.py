from django.db import models
from rest_framework.exceptions import ValidationError

from user.models import User


class Friend(models.Model):
    relate_user = models.ForeignKey(User, related_name="relate_users", on_delete=models.CASCADE)
    friend_user = models.ForeignKey(User, related_name="friend_users", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['relate_user', 'friend_user'], name='unique_friend')
        ]

    @classmethod
    def add_friend(cls, relate_user, friend_user):
        if relate_user == friend_user:
            raise ValidationError(detail={"detail": "자기 자신을 친구로 추가할 수 없습니다!"})
        if cls.objects.filter(relate_user=relate_user, friend_user=friend_user).exists():
            raise ValidationError(detail={"detail": "이미 친구로 추가한 유저입니다!"})
        return cls.objects.create(relate_user=relate_user, friend_user=friend_user)


