from rest_framework import serializers
from .models import Note, GoalTimer
from django.contrib.auth.models import User
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class NoteSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    drawing = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = ["id", "title", "body", "slug", "category", "created", "updated", "user", "username", "image", "drawing"]
    
    def get_username(self, obj):
        if obj.user:
            return obj.user.username
        return None

    def get_image(self, obj):
        if obj.image:
            try:
                return f"{settings.DOMAIN_NAME}{obj.image.url}"
            except Exception as e:
                print(f"Error getting image URL: {e}")
                return None
        return None

    def get_drawing(self, obj):
        if obj.drawing:
            try:
                return f"{settings.DOMAIN_NAME}{obj.drawing.url}"
            except Exception as e:
                print(f"Error getting drawing URL: {e}")
                return None
        return None

class GoalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalTimer
        fields = ['id', 'goal_time', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']