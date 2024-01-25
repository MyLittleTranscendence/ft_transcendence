from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is None:
        if isinstance(exc, IntegrityError):
            return Response({'detail': '중복된 데이터입니다'}, status=status.HTTP_409_CONFLICT)
        else:
            return Response({'detail': '알 수 없는 에러입니다'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
