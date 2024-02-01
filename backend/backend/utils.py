from rest_framework import serializers


def validate_serializer(serializer):
    if not serializer.is_valid():
        raise serializers.ValidationError(serializer.errors)

