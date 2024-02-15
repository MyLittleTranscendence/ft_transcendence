from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import routers, permissions

from block.views import BlockUserPost, BlockUserDelete, BlockUserListView
from chat.views import TotalMessage, SingleMessage, LoginMessage
from custom_auth.views import Login42CallBack, Login42, CustomTokenObtainPairView, MFACodeGenerateView, \
    MFATokenGenerateView, MFAEnableView, MFADisableView
from friend.views import FriendPostView, FriendDeleteView, FriendListView
from game.views import GameListView, SingleGameCreate, MoveBar, JoinMultiGameQueue, JoinTournamentGameQueue, \
    DeleteMultiGameQueue, DeleteTournamentGameQueue, ResponseAcceptQueue, InfoGame
from user import views
from user.views import UserProfileUpdateView, MyProfileGetView

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
router.register(r'check', views.UserCheckViewSet, basename="user check")

urlpatterns = [
    # viewSet
    path('api/', include(router.urls)),

    # default
    path('api/login/default/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("chat/", include("chat.urls")),
    path("game/", include("game.urls")),

    # user
    path('api/users/<int:pk>/profile-image/', UserProfileUpdateView.as_view(), name='userprofile-update'),
    path('api/me/', MyProfileGetView.as_view(), name='my-profile-get'),

    # custom_auth
    path('api/login/oauth2/42api/', Login42.as_view(), name='oauth-login-42'),
    path('api/login/oauth2/code/42api/', Login42CallBack.as_view(), name='oauth-redirect-42'),
    path('api/2fa/code/', MFACodeGenerateView.as_view(), name='2fa-code-generate'),
    path('api/2fa/token/', MFATokenGenerateView.as_view(), name='2fa-token-generate'),
    path('api/2fa/enable/', MFAEnableView.as_view(), name='2fa-enable'),
    path('api/2fa/disable/', MFADisableView.as_view(), name='2fa-disable'),

    # block
    path('api/users/<int:user_id>/blocks/', BlockUserPost.as_view(), name='user-block-post'),
    path('api/users/<int:user_id>/blocks/<int:block_id>/', BlockUserDelete.as_view(), name='user-block-delete'),
    path('api/blocks/', BlockUserListView.as_view(), name='user-block-list'),

    # friend
    path('api/users/<int:user_id>/friends/', FriendPostView.as_view(), name='user-friend-post'),
    path('api/users/<int:user_id>/friends/<int:friend_id>/', FriendDeleteView.as_view(), name='user-friend-delete'),
    path('api/friends/', FriendListView.as_view(), name='user-friend-list'),

    # chat
    path("api/socket/chat/single_message/", SingleMessage.as_view(), name="chat-single"),
    path("api/socket/chat/total_message/", TotalMessage.as_view(), name="chat-total"),
    path("api/socket/chat/login_message/", LoginMessage.as_view(), name="chat-login"),

    # game
    path('api/games/', GameListView.as_view(), name='game-list'),

    path("api/socket/game/single_game_create/", SingleGameCreate.as_view(), name="game-single-game-create"),
    path("api/socket/game/move_bar/", MoveBar.as_view(), name="move_bar"),
    path("api/socket/game/join_multi_game_queue/", JoinMultiGameQueue.as_view(), name="join_multi_game_queue"),
    path("api/socket/game/delete_multi_game_queue/", DeleteMultiGameQueue.as_view(), name="delete_multi_game_queue"),
    path("api/socket/game/join_tournament_game_queue/", JoinTournamentGameQueue.as_view(),
         name="join_tournament_game_queue"),
    path("api/socket/game/delete_tournament_game_queue/", DeleteTournamentGameQueue.as_view(),
         name="delete_tournament_game_queue"),
    path("api/socket/game/response_accept_queue/", ResponseAcceptQueue.as_view(), name="response_accept_queue"),
    path("api/socket/game/info_game/", InfoGame.as_view(), name="info_game"),

]

# urlpatterns += router.urls
# if settings.DEBUG:
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
