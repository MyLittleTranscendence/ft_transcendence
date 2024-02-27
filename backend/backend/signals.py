from asgiref.sync import async_to_sync
from blinker import Signal
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from block.models import BlockUser
from chat.consumers import ChatConsumer
from friend.models import Friend
from user.models import User

logout_signal = Signal()


@receiver(post_save, sender=User)
def user_updated(sender, instance, created, **kwargs):
    """
    사용자 정보 변경 시그널
    """
    channel_layer = get_channel_layer()
    message_type = "user.updated"
    async_to_sync(channel_layer.group_send)(
        f"{instance.id}_global",
        {
            "type": message_type,
            "nickname": instance.nickname,
            "profile_image": instance.profile_image.url
        }
    )


@receiver(logout_signal)
def handle_user_logout(sender, **kwargs):
    """
    사용자 로그아웃 시그널
    """
    user = kwargs.get('user')
    channel_layer = get_channel_layer()
    message_type = "user.logout"
    async_to_sync(channel_layer.group_send)(
        f"{user.id}_global",
        {
            "type": "user_logout",
            "user_id": user.id,
            "message": "로그아웃 하였습니다."
        }
    )


@receiver(post_save, sender=BlockUser)
def block_post(sender, instance, created, **kwargs):
    """
    차단 유저 추가 시그널
    """
    update_blocking_list(instance.blocker.id)


@receiver(post_delete, sender=BlockUser)
def block_delete(sender, instance, **kwargs):
    """
    차단 유저 삭제 시그널
    """
    update_blocking_list(instance.blocker.id)


def update_blocking_list(user_id):
    """
    차단 유저 정보가 변경 정보를 consumer에 전달
    """
    channel_layer = get_channel_layer()
    message_type = "block.updated"

    async_to_sync(channel_layer.group_send)(
        f"{user_id}{ChatConsumer.CONSUMER_GROUP}",
        {
            "type": message_type,
        }
    )


@receiver(post_save, sender=Friend)
def friend_post(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    message_type = "friend.updated"

    async_to_sync(channel_layer.group_send)(
        f"{instance.relate_user.id}{ChatConsumer.CONSUMER_GROUP}",
        {
            "type": message_type,
        }
    )
