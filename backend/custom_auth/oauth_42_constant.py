from backend import settings


class Oauth42Constant:
    __client_id = settings.CLIENT_ID_42
    __response_type = "code"
    __redirect_uri = f"{settings.BASE_URL}/api/login/oauth2/code/42api"
    __scope = "public"
    __client_secret = settings.CLIENT_SECRET_42
    __grant_type = "authorization_code"
    __state = "random_string"

    user_info_uri = "https://api.intra.42.fr/v2/me"

    authorization_uri = f"https://api.intra.42.fr/oauth/authorize" \
                        f"?client_id={__client_id}" \
                        f"&response_type={__response_type}" \
                        f"&redirect_uri={__redirect_uri}" \
                        f"&scope={__scope}"

    token_uri = f"https://api.intra.42.fr/oauth/token" \
                f"?client_id={__client_id}" \
                f"&client_secret={__client_secret}" \
                f"&grant_type={__grant_type}" \
                f"&redirect_uri={__redirect_uri}" \
                f"&state={__state}"
