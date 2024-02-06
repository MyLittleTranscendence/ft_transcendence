from django.db import models

from user.models import User


class BlockUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE)
