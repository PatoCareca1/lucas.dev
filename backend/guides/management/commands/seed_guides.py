import json
from pathlib import Path

from django.core.management.base import BaseCommand

from guides.models import Guide

# Bundled inside the app (not read from `frontend/`) so this works the same
# whether it's run from a full repo checkout or inside the backend's Docker
# container, which only ever has `backend/` copied into it. This is a
# one-time snapshot of the 3 chapters (pt+en) that used to live as markdown
# files in frontend/src/content/guides/{pt,en}/*.md before that content
# moved into the database — see git history prior to the "refactor: update
# guide search functionality..." commit if you ever need the original .md
# source.
DATA_PATH = Path(__file__).resolve().parent / "data" / "guides.json"


class Command(BaseCommand):
    help = (
        "One-off seed: import the 3 guide chapters (pt+en) that used to live as "
        "markdown files into the Guide table. Safe to re-run — it upserts by "
        "(slug, language)."
    )

    def handle(self, *args, **options):
        entries = json.loads(DATA_PATH.read_text(encoding="utf-8"))

        created, updated = 0, 0

        for entry in entries:
            defaults = {
                "chapter": entry["chapter"],
                "title": entry["title"],
                "description": entry["description"],
                "level": entry["level"],
                "stack": entry.get("stack", []),
                "prerequisites": entry.get("prerequisites", []),
                "not_needed": entry.get("notNeeded", []),
                "reading_time": entry["readingTime"],
                "published": entry.get("published", False),
                "published_at": entry.get("publishedAt"),
                "updated_at": entry.get("updatedAt"),
                "release_date": entry.get("releaseDate"),
                "repo_url": entry.get("repoUrl"),
                "body": entry.get("body", ""),
            }

            _, was_created = Guide.objects.update_or_create(
                slug=entry["slug"], language=entry["language"], defaults=defaults
            )
            created += was_created
            updated += not was_created
            self.stdout.write(f"  {'+' if was_created else '~'} {entry['language']}/{entry['slug']}")

        self.stdout.write(self.style.SUCCESS(f"Done: {created} created, {updated} updated."))
