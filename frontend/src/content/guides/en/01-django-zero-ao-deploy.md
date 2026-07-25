---
slug: django-zero-ao-deploy
chapter: 1
title: Django from zero to deploy
description: Environment, project, database, static files and a real deploy. The longest chapter in the track, and the only one you need to finish before the others.
level: iniciante
stack: [Python, Django, Docker, Postgres]
prerequisites:
  - 'Python 3.11 or newer, with `python --version` answering in your terminal.'
  - 'Comfort on the command line: navigating directories, editing files, exporting environment variables.'
  - 'Docker Engine 24+ or Docker Desktop installed and running.'
notNeeded: ['Django experience', 'advanced SQL', 'Kubernetes']
readingTime: 24
published: true
publishedAt: 2026-05-12
updatedAt: 2026-07-10
releaseDate: null
repoUrl: https://github.com/lucasdaniel/django-zero-ao-deploy
---

Most Django tutorials stop the moment the development server boots. This one starts there and goes until the application is serving requests from outside your machine, with Postgres, Gunicorn and a deploy process you can actually repeat.

## Environment: venv and pinned dependencies

Installing Django with `sudo pip install` is the project's first piece of technical debt. A virtual environment per project isolates versions and makes the build reproducible inside the container later on.

```bash
python -m venv .venv
source .venv/bin/activate
pip install "django==5.0.*" "psycopg[binary]" gunicorn whitenoise
pip freeze > requirements.txt
django-admin startproject config .
```

The trailing dot on `startproject` avoids the duplicated folder that gets in the way of the Dockerfile's `COPY` later.

## A project that is containerized from birth

Running in a container from day one means the gap between your machine and the server stops being a Friday afternoon surprise.

```dockerfile:Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
```

> [!note]
> `--workers 3` is not a magic number. Start at `2 × cores + 1` and tune by measuring, not by guessing.

## Postgres from the first commit

SQLite is comfortable and it lies to you. Constraints, types, concurrent transactions and ordering all behave differently in production.

- Migrations that pass on SQLite and fail on Postgres are a Friday-night classic.
- `JSONField`, partial indexes and `select_for_update` only truly exist on Postgres.
- Accent-aware ordering and text search depend on collation — something SQLite ignores.

> [!warning]
> With an empty `ALLOWED_HOSTS` in production, Django answers 400 before any useful log line. Set it in the very first environment variable you create.

## Per-environment configuration

A `settings/` package with `base`, `dev` and `prod` makes it explicit what changes between environments. A missing secret kills the boot immediately — and that is a good thing.

```python:config/settings/base.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")
```

## Static files, Gunicorn and Whitenoise

With `DEBUG=False` Django stops serving static files. Whitenoise fixes it with a single middleware line.

> [!pitfall]
> Forgetting `collectstatic` in the image build gives you a container that boots, responds, and serves the whole application without any CSS.

## Deploy: build, migrate, health check

Additive migrations before the traffic switch; dropping a column only on the following deploy.

## What is left out, for now

Caching, queues and observability get their own chapters. Finishing this one already puts the application online.
