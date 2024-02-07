from django.db import models

from user.models import User


class BlockUser(models.Model):
    blocker = models.ForeignKey(User, related_name="blockers", on_delete=models.CASCADE)
    blocking = models.ForeignKey(User, related_name="blockings", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocking'], name='unique_blocking')
        ]
