from rest_framework.serializers import Serializer
from rest_framework.exceptions import ValidationError
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST


def serializer_valid_check(serializer: Serializer, server=False):
    """
    클라이언트에게 전달받은 시리얼라이저 valid 검증
    """
    if not serializer.is_valid():
        raise ValidationError(serializer.errors, HTTP_400_BAD_REQUEST if not server else HTTP_500_INTERNAL_SERVER_ERROR)

