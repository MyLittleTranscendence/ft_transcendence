from django.db import models

from user.models import User


class Game(models.Model):
    left_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="left_user")
    right_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="right_user")
    left_score = models.IntegerField()
    right_score = models.IntegerField()
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner")
    created_at = models.DateTimeField(auto_now_add=True)
    game_type = models.CharField(max_length=30, null=True) # 널 허용 추후 제거
