from rest_framework import serializers


def validate_serializer(serializer):
    if not serializer.is_valid():
        raise serializers.ValidationError(serializer.errors)


def set_cookie(response, value, name):
    response.set_cookie(
        name,
        value=str(value),
        max_age=3600 * 24,
        httponly=True,
        secure=False,
        samesite='Lax'
    )
