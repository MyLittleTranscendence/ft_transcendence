import uuid
from datetime import datetime, timedelta

import pytz
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, User
from django.db import models
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed

from backend import settings
from backend.error_messages import Error


class UserManager(BaseUserManager):
    def create_user(self, username, email, nickname, password=None):
        """
        사용자 회원가입
        """
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            nickname=nickname,
            is_active=True,
            mfa_code=str(uuid.uuid4()),
            mfa_generate_time=datetime.now() - timedelta(minutes=settings.MFA_LIMIT_TIME)
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_oauth_user(self, email):
        """
        oauth 유저 회원가입
        """
        username = f'user_{uuid.uuid4()}'
        email = self.normalize_email(email)
        nickname = f'pingpong_{uuid.uuid4()}'
        password = str(uuid.uuid4())
        return self.create_user(username, email, nickname, password)


def upload_to(instance, filename):
    """
    이미지 저장 경로 결정
    """
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return f'profile_images/{filename}'


class User(AbstractUser):
    nickname = models.CharField(max_length=100, unique=True)
    profile_image = models.ImageField(upload_to=upload_to, default='profile_images/default.png')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    mfa_enable = models.BooleanField(default=False)
    mfa_code = models.CharField(max_length=100)
    mfa_generate_time = models.DateTimeField()

    objects = UserManager()

    def update_mfa_code(self):
        """
        mfa code 발급 정보 저장
        """
        code = str(uuid.uuid4())
        self.mfa_code = code
        self.mfa_generate_time = datetime.now()
        self.save(update_fields=['mfa_code', 'mfa_generate_time'])
        return self

    def mfa_code_check(self, mfa_code):
        """
        mfa 코드 검증
        """
        utc_now = datetime.now(pytz.utc)
        if not self.mfa_enable:
            raise PermissionDenied(Error.EFA_DISABLED)
        if utc_now - timedelta(minutes=settings.MFA_LIMIT_TIME) > self.mfa_generate_time:
            raise AuthenticationFailed(Error.CODE_TIMEOUT)
        if self.mfa_code != mfa_code:
            raise AuthenticationFailed(Error.CODE_INVALID)

    def update_mfa_disable(self):
        """
        mfa disable
        """
        if not self.mfa_enable:
            raise PermissionDenied(Error.EFA_ALREADY_DISABLED)
        self.mfa_enable = False
        self.save(update_fields=['mfa_enable'])

    def update_mfa_enable(self, mfa_code):
        """
        mfa enable
        """
        utc_now = datetime.now(pytz.utc)
        if self.mfa_enable:
            raise PermissionDenied(Error.EFA_ALREADY_ENABLED)
        if utc_now - timedelta(minutes=settings.MFA_LIMIT_TIME) > self.mfa_generate_time:
            raise AuthenticationFailed(Error.CODE_TIMEOUT)
        if self.mfa_code != mfa_code:
            raise AuthenticationFailed(Error.CODE_INVALID)
        self.mfa_enable = True
        self.save(update_fields=['mfa_enable'])

    def increase_wins(self):
        """
        승리 카운트 증가
        """
        self.wins += 1
        self.save()

    def increase_losses(self):
        """
        패배 카운트 증가
        """
        self.losses += 1
        self.save()
