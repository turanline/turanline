import os
from datetime import timedelta
from pathlib import Path

import environ
from django.utils.translation import gettext_lazy as _
from googletrans import Translator

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)

environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
BASE_DOMAIN = env("BASE_DOMAIN")
translator = Translator()

SECRET_KEY = env("SECRET_KEY")

DEBUG = env("DEBUG")

ALLOWED_HOSTS = [
    'mis-express.com',
    '127.0.0.1',
    'localhost',
    'me-backend-app',
    'me-backend-app:8000',
    'www.mis-express.com',
    BASE_DOMAIN
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "products",
    "users",
    "payment",
    "product_components",
    "customers",
    "cart",
    "providers",
    "delivery",
    "import_export",
    "django_filters",
    "parler",
    "mptt",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "mssite.middleware.Process500Error",
]

if DEBUG:
    INSTALLED_APPS.append("debug_toolbar")
    MIDDLEWARE.append("debug_toolbar.middleware.DebugToolbarMiddleware")


ROOT_URLCONF = "mssite.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mssite.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", default=""),
        "USER": env("POSTGRES_USER", default=""),
        "PASSWORD": env("POSTGRES_PASSWORD", default=""),
        "HOST": env("POSTGRES_HOST", default=""),
        "PORT": env("POSTGRES_PORT", cast=int, default=5432),
        "ATOMIC_REQUESTS": True,
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en"

LANGUAGES = [
    ("ru", _("Russian")),
    ("en", _("English")),
    ("tr", _("Turkish")),
]

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = "users.User"

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'collected_static'

MEDIA_URL = "https://" + BASE_DOMAIN + "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle"
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/min",
        "user": "100/min"
    }
}


SPECTACULAR_SETTINGS = {
    "TITLE": "MiSEXPRESS",
    "DESCRIPTION": "MiSEXPRESS Website API",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SWAGGER_UI_DIST": "SIDECAR",
    "SWAGGER_UI_FAVICON_HREF": "SIDECAR",
    "REDOC_DIST": "SIDECAR",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.CustomTokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}


CSRF_TRUSTED_ORIGINS = ["https://mis-express.com", "https://" + BASE_DOMAIN]
CORS_ORIGIN_ALLOW_ALL = True

LOG_DIR = os.path.join(BASE_DIR, 'logs')

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default_formatter": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        }
    },
    "handlers": {
        "file": {
            "level": "WARNING",
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "logs/logs.log"),
            "formatter": "default_formatter",
        },
    },
    "loggers": {
        "mssite": {
            "level": "WARNING",
            "handlers": ["file"],
            "propagate": True,
        },
        "products": {
            "level": "WARNING",
            "handlers": ["file"],
            "propagate": True,
        },
        "payment": {
            "level": "ERROR",
            "handlers": ["file"],
            "propagate": True,
        },
        "users": {
            "level": "WARNING",
            "handlers": ["file"],
            "propagate": True,
        },
        "clients": {
            "level": "WARNING",
            "handlers": ["file"],
            "propagate": True,
        },
    },
}


PARLER_LANGUAGES = {
    None: (
        {'code': 'en'},
        {'code': 'ru'},
        {'code': 'tr'},
    ),
    'default': {
        'fallbacks': ['en'],
        'hide_untranslated': False,
    }
}

#Twilio settings
TWILIO_ACCOUNT_SID = env("MY_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = env("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = env("MY_TWILIO_NUMBER")

#SMSAero settings
SMSAERO_EMAIL = env("SMSAERO_EMAIL")
SMSAERO_API_KEY = env("SMSAERO_API_KEY")

#Redis settings
REDIS_HOST = env("REDIS_HOST")
REDIS_PORT = env("REDIS_PORT")

#Payment system
CLIENT_ID = env("CLIENT_ID")
STORE_KEY = env("STORE_KEY")
PAYMENT_URL = env("PAYMENT_URL")
BACKEND_PAYMENT_SUCCESS_URL = env("BACKEND_PAYMENT_SUCCESS_URL")
BACKEND_PAYMENT_FAIL_URL = env("BACKEND_PAYMENT_FAIL_URL")
FRONTEND_PAYMENT_SUCCESS_URL = env("FRONTEND_PAYMENT_SUCCESS_URL")
FRONTEND_PAYMENT_FAIL_URL = env("FRONTEND_PAYMENT_FAIL_URL")
