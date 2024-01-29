from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers, permissions

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from custom_auth.views import Login42CallBack, Login42
from user import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user.views import UserProfileUpdateView

schema_view = get_schema_view(
    openapi.Info(
        title="My Project API",
        default_version="v1",

        description="API documentation for My Project",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"), license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/users/<int:pk>/profile_image/', UserProfileUpdateView.as_view(), name='userprofile-update'),
    path('api/login/oauth2/42api', Login42.as_view(), name='oauth-login-42'),
    path('api/login/oauth2/code/42api', Login42CallBack.as_view(), name='oauth-redirect-42'),
]

# urlpatterns += router.urls
# if settings.DEBUG:
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
