"""Client-IP resolution for django-ratelimit, used only when
`BEHIND_REVERSE_PROXY=True` (see settings.py) — i.e. only in production,
behind the Caddy reverse proxy defined in `Caddyfile`.

Caddy is the *only* hop between the internet and this app (Postgres and the
Django container are never published to the host in
`docker-compose.prod.yml`). Caddy's `reverse_proxy` appends the peer it
actually saw to `X-Forwarded-For` rather than trusting/forwarding a
client-supplied value verbatim — so the *last* entry in that header is the
one Caddy itself observed, while everything before it may be attacker-
supplied. Do not reuse this helper if anything other than Caddy could ever
sit in front of Django, or you'd be trusting a spoofable client header.
"""

from django.http import HttpRequest


def get_client_ip(request: HttpRequest) -> str:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[-1].strip()
    return request.META.get("REMOTE_ADDR", "")
