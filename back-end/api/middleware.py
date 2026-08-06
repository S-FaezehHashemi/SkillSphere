
import logging

logger = logging.getLogger(__name__)

_EXCLUDED_PREFIXES = ("/admin/", "/static/", "/media/", "/favicon.ico")


class ActivityLogMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        path = request.path_info
        if any(path.startswith(prefix) for prefix in _EXCLUDED_PREFIXES):
            return response

        try:
            from .models import ActivityLog
            user = self._resolve_user(request)

            ActivityLog.objects.create(
                user=user,
                action=request.method,
                endpoint=path,
            )
        except Exception:
            logger.exception("ActivityLogMiddleware failed to write log entry.")

        return response

    @staticmethod
    def _resolve_user(request):
        if hasattr(request, "user") and request.user.is_authenticated:
            return request.user

        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            try:
                from rest_framework_simplejwt.authentication import JWTAuthentication

                jwt_auth = JWTAuthentication()
                validated = jwt_auth.get_validated_token(
                    jwt_auth.get_raw_token(
                        jwt_auth.get_header(request)
                    )
                )
                return jwt_auth.get_user(validated)
            except Exception:
                pass

        return None
