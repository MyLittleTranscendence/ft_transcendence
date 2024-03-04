# mysite/asgi.py
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from backend.middleware import JWTAuthMiddlewareStack
from backend.routing import websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
