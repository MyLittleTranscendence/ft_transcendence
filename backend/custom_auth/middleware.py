class JWTAuthenticationMiddleware:
    """
    쿠키로 전달된 jwt를 authorization 헤더로 변환해서 전달
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
        response = self.get_response(request)
        return response
