from django_ratelimit.exceptions import Ratelimited
from ninja import NinjaAPI

from guides.api import router as guides_router
from projects.api import router as projects_router

api = NinjaAPI(title="lucas.dev API", version="1.0.0")

api.add_router("/guides", guides_router)
api.add_router("/projects", projects_router)


@api.exception_handler(Ratelimited)
def rate_limited(request, exc):
    return api.create_response(request, {"detail": "Too many requests"}, status=429)


@api.get("/health", tags=["meta"])
def health(request):
    """Liveness check — used by the Docker healthcheck and uptime monitors.

    Intentionally does not touch the database: it should report the process
    is up even if Postgres is temporarily unreachable.
    """
    return {"status": "ok"}
