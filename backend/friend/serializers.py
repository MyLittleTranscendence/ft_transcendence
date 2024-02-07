from rest_framework import serializers

from friend.models import Friend


class FriendSerializer(serializers.ModelSerializer):
    friend_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='friend_user.id')
    nickname = serializers.ReadOnlyField(source='friend_user.nickname')
    profile_image = serializers.ImageField(source='friend_user.profile_image', use_url=True, read_only=True)

    class Meta:
        model = Friend
        fields = ['friend_id', 'user_id', 'nickname', 'profile_image']
