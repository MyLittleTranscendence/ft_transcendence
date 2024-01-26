from django.db import models

from user.models import User


class Oauth42User(models.Model):
    login = models.CharField(max_length=30, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
