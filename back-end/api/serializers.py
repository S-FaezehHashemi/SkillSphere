
import os

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import ActivityLog, Notification, Project, User


MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".zip"}



class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data.get("full_name", ""),
        )

class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "created_at"]
        read_only_fields = fields


class ProjectSerializer(serializers.ModelSerializer):

    owner = UserProfileSerializer(read_only=True)
    tag_list = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            "id", "title", "description", "owner",
            "file_path", "tags", "tag_list", "created_at",
        ]
        read_only_fields = ["id", "owner", "created_at"]

    def validate_file_path(self, value):
        if value is None:
            return value

        if value.size > MAX_FILE_SIZE_BYTES:
            raise serializers.ValidationError(
                f"File size must not exceed 10 MB. "
                f"Uploaded file is {value.size / 1024 / 1024:.1f} MB."
            )

        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported file type '{ext}'. "
                f"Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
            )

        return value
 


class ProjectWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ["title", "description", "file_path", "tags"]

    def validate_file_path(self, value):
        return ProjectSerializer().validate_file_path(value)



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "is_read", "created_at"]
        read_only_fields = ["id", "created_at"]



class ActivityLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True, default=None)

    class Meta:
        model = ActivityLog
        fields = ["id", "user_email", "action", "endpoint", "timestamp"]
        read_only_fields = fields
