import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from projects.models import Project, ProjectTranslation

LOCALES_DIR = Path(settings.BASE_DIR).parent / "frontend" / "src" / "locales"

# Same order as `projectKeys` in frontend/src/pages/Projects.tsx.
PROJECT_ORDER = ["sapo", "plp", "prp", "cineReserve", "crowdless", "miniShell", "fitTrack"]


class Command(BaseCommand):
    help = (
        "One-off migration: import the 7 projects that used to live as "
        "`projects.*` keys in frontend/src/locales/{pt,en}/translation.json "
        "into Project/ProjectTranslation. Safe to re-run — it upserts."
    )

    def handle(self, *args, **options):
        entries_by_language = {}
        for language in ("pt", "en"):
            path = LOCALES_DIR / language / "translation.json"
            if not path.exists():
                raise CommandError(f"Translation file not found: {path}")
            data = json.loads(path.read_text(encoding="utf-8"))
            entries_by_language[language] = data["projects"]

        created, updated = 0, 0

        for order, slug in enumerate(PROJECT_ORDER):
            pt_entry = entries_by_language["pt"][slug]

            project, _ = Project.objects.update_or_create(
                slug=slug,
                defaults={
                    "tech_stack": pt_entry.get("tech_stack", []),
                    "site_url": pt_entry.get("site_url"),
                    "repo_url": pt_entry.get("repo_url"),
                    "order": order,
                },
            )

            for language in ("pt", "en"):
                entry = entries_by_language[language][slug]
                _, was_created = ProjectTranslation.objects.update_or_create(
                    project=project,
                    language=language,
                    defaults={
                        "title": entry["title"],
                        "tag": entry["tag"],
                        "short_desc": entry["short_desc"],
                        "challenge": entry["challenge"],
                        "solution": entry["solution"],
                        "solution_details": entry.get("solution_details", {}),
                        "impact": entry.get("impact", []),
                        "disclaimer": entry.get("disclaimer", ""),
                        "quote": entry.get("quote", ""),
                        "link_label": entry.get("link_label", ""),
                    },
                )
                created += was_created
                updated += not was_created

            self.stdout.write(f"  {slug}")

        self.stdout.write(self.style.SUCCESS(f"Done: {created} translations created, {updated} updated."))
