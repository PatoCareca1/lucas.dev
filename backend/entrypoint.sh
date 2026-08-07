#!/bin/sh
set -e

# Safe to run on every start: idempotent, doesn't touch the database, and
# needed for Django admin's CSS/JS to be served correctly via WhiteNoise.
# Migrations are deliberately NOT run here — that stays a manual,
# explicit step (`docker compose exec backend python manage.py migrate`).
python manage.py collectstatic --noinput

exec "$@"
