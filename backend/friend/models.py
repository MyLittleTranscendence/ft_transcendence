from django.db import models
from rest_framework.exceptions import ValidationError

from backend.error_messages import Error
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
        """
        친구 추가
        """
        if relate_user == friend_user:
            raise ValidationError(detail={"detail": Error.CANNOT_FRIEND_SELF})
        if cls.objects.filter(relate_user=relate_user, friend_user=friend_user).exists():
            raise ValidationError(detail={"detail": Error.ALREADY_FRIEND})
        return cls.objects.create(relate_user=relate_user, friend_user=friend_user)


