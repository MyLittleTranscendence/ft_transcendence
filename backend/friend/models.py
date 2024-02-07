from django.db import models

from user.models import User


class Friend(models.Model):
    relate_user = models.ForeignKey(User, related_name="relate_users", on_delete=models.CASCADE)
    friend_user = models.ForeignKey(User, related_name="friend_users", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['relate_user', 'friend_user'], name='unique_friend')
        ]