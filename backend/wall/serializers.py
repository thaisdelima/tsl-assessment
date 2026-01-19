from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    # Show the username instead of the numeric ID
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Message
        fields = ['id', 'user', 'content', 'created_at']