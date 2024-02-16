from django.db import models
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


