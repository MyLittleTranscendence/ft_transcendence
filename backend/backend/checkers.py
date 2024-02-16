from rest_framework.serializers import Serializer
from rest_framework.exceptions import ValidationError


def serializer_valid_check(serializer: Serializer):
    """
    클라이언트에게 전달받은 시리얼라이저 valid 검증
    """
    if not serializer.is_valid():
        raise ValidationError(serializer.errors)
