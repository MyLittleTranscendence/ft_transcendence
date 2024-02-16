from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from backend.error_messages import Error


class CustomJWTAuthentication(JWTAuthentication):
    """
    2fa 페이로드를 검증하는 인증계층
    """
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        mfa_require = validated_token.payload.get('mfa_require')
        if mfa_require is None or mfa_require:
            raise AuthenticationFailed(Error.MFA_REQUIRED)
        return validated_token
