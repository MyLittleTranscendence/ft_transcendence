from django.db import models, transaction

from user.models import User


class Game(models.Model):
    left_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="left_user")
    right_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="right_user")
    left_score = models.IntegerField()
    right_score = models.IntegerField()
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner")
    created_at = models.DateTimeField(auto_now_add=True)
    game_type = models.CharField(max_length=30, null=True)  # 널 허용 추후 제거

    @classmethod
    @transaction.atomic
    def create_new_game_and_update_score(cls, game_info: dict):
        """
        게임 정보를 저장하고 승패를 업데이트.
        """
        left_user = User.objects.get(pk=game_info.get("left_user_id"))
        right_user = User.objects.get(pk=game_info.get("right_user_id"))
        winner_user = User.objects.get(pk=game_info.get("winner"))
        loser_user = right_user if left_user == winner_user else left_user
        winner_user.increase_wins()
        loser_user.increase_losses()
        cls.objects.create(
            left_user=left_user,
            right_user=right_user,
            winner=winner_user,
            left_score=game_info.get("left_score"),
            right_score=game_info.get("right_score"),
            game_type=game_info.get("game_type"),
        )
