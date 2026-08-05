
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet, basename="project")

urlpatterns = [
    path("auth/register/", views.RegisterView.as_view(), name="auth-register"),
    path("auth/login/", views.LoginView.as_view(), name="auth-login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/me/", views.MeView.as_view(), name="auth-me"),

    path("", include(router.urls)),

    path("notifications/", views.NotificationListView.as_view(), name="notification-list"),
    path(
        "notifications/<int:pk>/read/",
        views.NotificationMarkReadView.as_view(),
        name="notification-read",
    ),

    path("logs/", views.ActivityLogListView.as_view(), name="activity-logs"),

    path("analytics/dashboard/", views.UserDashboardView.as_view(), name="analytics-dashboard"),
    path("analytics/system/", views.SystemAnalyticsView.as_view(), name="analytics-system"),
]
