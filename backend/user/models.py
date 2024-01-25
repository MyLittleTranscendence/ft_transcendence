import uuid

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, User
from django.db import models


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


def upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return f'profile_images/{filename}'


class User(AbstractUser):
    nickname = models.CharField(max_length=100, unique=True)
    profile_image = models.ImageField(upload_to=upload_to, default='default.png')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)