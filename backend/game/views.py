from django.shortcuts import render


def single_game(request):
    return render(request, "game/single_game.html")
