
from django.db.models import Count
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import ActivityLog, Notification, Project, User
from .serializers import (
    ActivityLogSerializer,
    NotificationSerializer,
    ProjectSerializer,
    ProjectWriteSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)
from .notifications import send_notification
from .tasks import send_project_upload_notification



class RegisterView(generics.CreateAPIView):


    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"detail": "Account created successfully.", "user_id": user.id},
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):

    permission_classes = [permissions.AllowAny]



class MeView(generics.RetrieveAPIView):

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



class ProjectViewSet(viewsets.ModelViewSet):

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.select_related("owner").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProjectWriteSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)

        send_notification(
            self.request.user,
            f"Your project '{project.title}' was uploaded successfully.",
        )

        send_project_upload_notification.delay(
            user_email=self.request.user.email,
            project_title=project.title,
        )

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"], url_path="mine")
    def my_projects(self, request):
        qs = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ProjectSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ProjectSerializer(qs, many=True)
        return Response(serializer.data)



class NotificationListView(generics.ListAPIView):


    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by(
            "is_read", "-created_at"
        )


class NotificationMarkReadView(generics.UpdateAPIView):


    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(
            self.get_serializer(notification).data,
            status=status.HTTP_200_OK,
        )



class ActivityLogListView(generics.ListAPIView):

    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ActivityLog.objects.select_related("user").all()



class UserDashboardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        stats = {
            "total_projects": Project.objects.filter(owner=user).count(),
            "unread_notifications": Notification.objects.filter(
                user=user, is_read=False
            ).count(),
            "total_notifications": Notification.objects.filter(user=user).count(),
            "recent_projects": ProjectSerializer(
                Project.objects.filter(owner=user).order_by("-created_at")[:5],
                many=True,
            ).data,
        }
        return Response(stats)


class SystemAnalyticsView(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        stats = {
            "total_users": User.objects.count(),
            "total_projects": Project.objects.count(),
            "total_activity_logs": ActivityLog.objects.count(),
            "projects_per_user": list(
                Project.objects.values("owner__email")
                .annotate(project_count=Count("id"))
                .order_by("-project_count")[:10]
            ),
            "top_endpoints": list(
                ActivityLog.objects.values("endpoint")
                .annotate(hit_count=Count("id"))
                .order_by("-hit_count")[:10]
            ),
        }
        return Response(stats)
