from ninja import NinjaAPI

api = NinjaAPI(title="lucas.dev API", version="1.0.0")


@api.get("/health", tags=["meta"])
def health(request):
    """Liveness check — used by the Docker healthcheck and uptime monitors.

    Intentionally does not touch the database: it should report the process
    is up even if Postgres is temporarily unreachable.
    """
    return {"status": "ok"}
