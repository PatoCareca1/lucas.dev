from pathlib import Path

import frontmatter
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from guides.models import Guide

CONTENT_DIR = Path(settings.BASE_DIR).parent / "frontend" / "src" / "content" / "guides"


class Command(BaseCommand):
    help = (
        "One-off migration: import the Markdown files that used to live in "
        "frontend/src/content/guides/{pt,en}/*.md into the Guide table. "
        "Safe to re-run — it upserts by (slug, language)."
    )

    def handle(self, *args, **options):
        if not CONTENT_DIR.exists():
            raise CommandError(f"Content directory not found: {CONTENT_DIR}")

        created, updated = 0, 0

        for language_dir in sorted(CONTENT_DIR.iterdir()):
            if not language_dir.is_dir():
                continue
            language = language_dir.name

            for md_path in sorted(language_dir.glob("*.md")):
                post = frontmatter.load(md_path)
                data = post.metadata

                defaults = {
                    "chapter": data["chapter"],
                    "title": data["title"],
                    "description": data["description"],
                    "level": data["level"],
                    "stack": data.get("stack", []),
                    "prerequisites": data.get("prerequisites", []),
                    "not_needed": data.get("notNeeded", []),
                    "reading_time": data["readingTime"],
                    "published": data.get("published", False),
                    "published_at": data.get("publishedAt"),
                    "updated_at": data.get("updatedAt"),
                    "release_date": data.get("releaseDate"),
                    "repo_url": data.get("repoUrl"),
                    "body": post.content.strip() + "\n",
                }

                _, was_created = Guide.objects.update_or_create(
                    slug=data["slug"], language=language, defaults=defaults
                )
                created += was_created
                updated += not was_created
                self.stdout.write(f"  {'+' if was_created else '~'} {language}/{data['slug']}")

        self.stdout.write(self.style.SUCCESS(f"Done: {created} created, {updated} updated."))
