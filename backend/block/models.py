from django.db import models
from rest_framework.exceptions import ValidationError

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
        if cls.objects.filter(blocker=blocker, blocking=blocking).exists():
            raise ValidationError(detail={"detail": "이미 차단한 유저입니다!"})
        return cls.objects.create(blocker=blocker, blocking=blocking)


