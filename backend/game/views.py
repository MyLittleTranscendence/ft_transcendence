from django.shortcuts import render


def single_game(request):
    return render(request, "game/single_game.html")


def multi_game(request):
    return render(request, "game/multi_game.html")


def tournament_game(request):
    return render(request, "game/tournament_game.html")
