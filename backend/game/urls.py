# game/urls.py
from django.urls import path

from . import views


urlpatterns = [
    path("single-game/", views.single_game, name="single-game"),
    path("multi-game/", views.multi_game, name="multi-game"),

]
