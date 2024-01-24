from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email, nickname, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            nickname=nickname
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    nickname = models.CharField(max_length=100)
    profileImageUrl = models.CharField(max_length=100, blank=False, default="default_png")
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
