
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import ActivityLog, Notification, Project, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin config for the custom User model."""

    ordering = ["-created_at"]
    list_display = ["email", "full_name", "is_staff", "is_active", "created_at"]
    list_filter = ["is_staff", "is_active", "created_at"]
    search_fields = ["email", "full_name"]
    readonly_fields = ["created_at", "last_login", "date_joined"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("full_name",)}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined", "created_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "password1", "password2"),
            },
        ),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "owner", "created_at", "tags"]
    list_filter = ["created_at"]
    search_fields = ["title", "description", "owner__email", "tags"]
    raw_id_fields = ["owner"]
    readonly_fields = ["created_at"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "is_read", "created_at", "short_message"]
    list_filter = ["is_read", "created_at"]
    search_fields = ["user__email", "message"]
    readonly_fields = ["created_at"]

    @admin.display(description="Message preview")
    def short_message(self, obj):
        return obj.message[:80]


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ["action", "endpoint", "user", "timestamp"]
    list_filter = ["action", "timestamp"]
    search_fields = ["endpoint", "user__email"]
    readonly_fields = ["user", "action", "endpoint", "timestamp"]

    def has_add_permission(self, request):
        return False


    def has_change_permission(self, request, obj=None):
        return False
