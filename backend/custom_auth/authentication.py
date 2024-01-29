from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        mfa_require = validated_token.payload.get('mfa_require')
        if mfa_require is None or mfa_require:
            raise AuthenticationFailed('MFA authentication required')
        return validated_token
