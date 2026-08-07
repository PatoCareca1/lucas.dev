"""
Django settings for core project.

Configuration that varies between environments (secrets, hosts, database
credentials) is read from environment variables — see `.env.example` for the
full list. Locally these are loaded from a `.env` file next to `manage.py`;
in production they come from the deployment environment (Docker Compose).
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


def env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY environment variable is required. Copy backend/.env.example "
        "to backend/.env and fill it in."
    )

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env_bool("DEBUG", False)

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "localhost,127.0.0.1")

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
)

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")

# Only set this to True once Caddy (or another reverse proxy) is confirmed
# to be the *only* way to reach this app (see docker-compose.prod.yml —
# Postgres and this container are never published to the host there). Both
# settings below trust client-controllable-looking headers
# (X-Forwarded-Proto / X-Forwarded-For); that's only safe when a proxy you
# control is guaranteed to set them itself rather than passing through
# whatever the client sent. Defaults to False so local/dev runs (where the
# backend's port is exposed directly, no proxy in front) never trust them.
BEHIND_REVERSE_PROXY = env_bool("BEHIND_REVERSE_PROXY", False)

if BEHIND_REVERSE_PROXY:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    # Used by django-ratelimit (see guides/api.py) to key the feedback
    # endpoint's rate limit on the real client IP instead of Caddy's.
    RATELIMIT_IP_META_KEY = "core.ratelimit.get_client_ip"


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "guides",
    "projects",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "lucasdev"),
        "USER": os.environ.get("POSTGRES_USER", "lucasdev"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", ""),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# WhiteNoise serves static files (Django admin's CSS/JS) straight out of
# Gunicorn, compressed and cache-busted by hash — no separate static file
# server or shared volume with Caddy needed. `entrypoint.sh` runs
# `collectstatic` on every container start, so STATIC_ROOT is always
# populated before Gunicorn/runserver starts serving requests.
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Django's default cache (LocMemCache) is per-process. Gunicorn runs this
# app with multiple worker *processes* (not threads), so django-ratelimit's
# counters would otherwise be split across workers — e.g. with 3 workers, a
# "10/h" limit effectively becomes up to ~30/h, spread unpredictably
# depending on which worker handles each request. FileBasedCache is shared
# on disk by every worker on the same machine, no extra service required.
#
# Deliberately outside BASE_DIR (which is bind-mounted as `./backend:/app`
# in dev): this is disposable, container-local state, not source code — it
# should never leak onto the host or interact with `.dockerignore`.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": "/tmp/django_cache",
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
