from django.db import models
from django.db.models import Q
from rest_framework.exceptions import ValidationError

from backend.error_messages import Error
from user.models import User


class BlockUser(models.Model):
    blocker = models.ForeignKey(User, related_name="blockers", on_delete=models.CASCADE)
    blocking = models.ForeignKey(User, related_name="blockings", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocking'], name='unique_blocking')
        ]

    @classmethod
    def block(cls, blocker, blocking):
        """
        사용자를 차단
        """
        if blocker == blocking:
            raise ValidationError({"detail": Error.CANNOT_BLOCK_SELF})
        if cls.objects.filter(blocker=blocker, blocking=blocking).exists():
            raise ValidationError({"detail": Error.ALREADY_BLOCK_USER})
        return cls.objects.create(blocker=blocker, blocking=blocking)

    @classmethod
    def is_blocked(cls, sender_id, receiver_id):
        """
        상호간 차단한 사람이 있는지 여부 반환
        """
        return cls.objects.filter(
            Q(blocker_id=sender_id, blocking_id=receiver_id) |
            Q(blocker_id=receiver_id, blocking_id=sender_id)
        ).exists()
