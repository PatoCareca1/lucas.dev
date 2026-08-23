import os

import pytest
from django.core.cache import cache

os.environ.setdefault("SECRET_KEY", "test-only-secret-key")
os.environ.setdefault("DEBUG", "False")


@pytest.fixture(autouse=True)
def isolated_cache(settings):
    settings.CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "tests",
        }
    }
    cache.clear()
    yield
    cache.clear()
