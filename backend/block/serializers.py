from rest_framework import serializers

from block.models import BlockUser


class BlockedUserSerializer(serializers.ModelSerializer):
    block_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='blocking.id')
    nickname = serializers.ReadOnlyField(source='blocking.nickname')
    profile_image = serializers.ImageField(source='blocking.profile_image', use_url=True, read_only=True)

    class Meta:
        model = BlockUser
        fields = ['block_id', 'user_id', 'nickname', 'profile_image']
