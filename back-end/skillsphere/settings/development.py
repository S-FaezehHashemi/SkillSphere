from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "skillsphere_db",
        "USER": "skillsphere_user",
        "PASSWORD": "skill12345678",
        "HOST": "127.0.0.1",
        "PORT": "5432",
    }
}

CELERY_BROKER_URL = "redis://localhost:6380/0"
CELERY_RESULT_BACKEND = "redis://localhost:6380/0"

CORS_ALLOW_ALL_ORIGINS = True

# Show emails in the console for easier development.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"