from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from backend import settings
from user.models import User


@receiver(post_save, sender=User)
def user_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    message_type = "user.updated"
    async_to_sync(channel_layer.group_send)(
        f"{instance.id}_global",
        {
            "type": message_type,
            "nickname": instance.nickname,
            "profile_image": f"{settings.BASE_URL}{instance.profile_image.url}"
        }
    )
