from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import is_password_usable, make_password
from django.contrib.auth.models import AbstractUser, User
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver


class UserManager(BaseUserManager):
    def create_user(self, username, email, nickname, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            nickname=nickname,
            is_active=True
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    nickname = models.CharField(max_length=100)
    profileImageUrl = models.CharField(max_length=100, blank=False, default="default_png")
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    # @receiver(pre_save, sender=User)
    # def password_hashing(instance, **kwargs):
    #     if not is_password_usable(instance.password):
    #         instance.password = make_password(instance.password)