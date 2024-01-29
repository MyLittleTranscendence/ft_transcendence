from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        #
        # is_mfa = validated_token.payload.get('isMFA')
        # if is_mfa is None or not is_mfa:
        #     raise AuthenticationFailed('MFA authentication required')
        # raise AuthenticationFailed("MFA")
        return validated_token
