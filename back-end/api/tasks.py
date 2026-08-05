
import logging

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_project_upload_notification(self, user_email: str, project_title: str):
    try:
        logger.info(
            "📧 [Celery] Sending upload notification to '%s' for project '%s'.",
            user_email,
            project_title,
        )

        # ── Simulated email send ───────────────────────────────────────────
        subject = f"SkillSphere — Your project '{project_title}' was uploaded"
        message = (
            f"Hi,\n\n"
            f"Your project '{project_title}' has been successfully uploaded to SkillSphere.\n\n"
            f"The SkillSphere Team"
        )
        logger.info("✅ [Celery] Notification email dispatched to '%s'.", user_email)
        return {"status": "sent", "recipient": user_email}

    except Exception as exc:
        logger.exception(
            "❌ [Celery] Failed to send notification to '%s'. Retrying…",
            user_email,
        )
        raise self.retry(exc=exc)


@shared_task
def mark_old_notifications_read(days: int = 30):
    from datetime import timedelta

    from django.utils import timezone

    from .models import Notification

    cutoff = timezone.now() - timedelta(days=days)
    updated = Notification.objects.filter(
        is_read=False, created_at__lt=cutoff
    ).update(is_read=True)

    logger.info("🔔 [Celery] Marked %d old notifications as read.", updated)
    return {"marked_read": updated}
