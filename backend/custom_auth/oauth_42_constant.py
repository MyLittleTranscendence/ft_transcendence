from backend import settings


class Oauth42Constant:
    client_id = settings.CLIENT_ID_42
    response_type = "code"
    redirect_uri = "http://localhost:8000/api/login/oauth2/code/42api"
    scope = "public"
    client_secret = settings.CLIENT_SECRET_42
    grant_type = "authorization_code"
    state = "random_string"
    user_info_uri = "https://api.intra.42.fr/v2/me"

    authorization_uri = f"https://api.intra.42.fr/oauth/authorize" \
                        f"?client_id={client_id}" \
                        f"&response_type={response_type}" \
                        f"&redirect_uri={redirect_uri}" \
                        f"&scope={scope}"

    token_uri = f"https://api.intra.42.fr/oauth/token" \
                f"?client_id={client_id}" \
                f"&client_secret={client_secret}" \
                f"&grant_type={grant_type}" \
                f"&redirect_uri={redirect_uri}" \
                f"&state={state}"
