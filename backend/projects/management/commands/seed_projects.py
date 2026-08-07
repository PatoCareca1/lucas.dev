import json
from pathlib import Path

from django.core.management.base import BaseCommand

from projects.models import Project, ProjectTranslation

# Bundled inside the app (not read from `frontend/`) so this works the same
# whether it's run from a full repo checkout or inside the backend's Docker
# container, which only ever has `backend/` copied into it. The JSON here is
# a one-time snapshot of what used to be the `projects.*` keys in
# frontend/src/locales/{pt,en}/translation.json before that content moved
# into the database (see git history prior to the "refactor: project
# handling and localization" commit if you ever need the original source).
DATA_PATH = Path(__file__).resolve().parent / "data" / "projects.json"

# Same order as `projectKeys` used to be in frontend/src/pages/Projects.tsx.
PROJECT_ORDER = ["sapo", "plp", "prp", "cineReserve", "crowdless", "miniShell", "fitTrack"]


class Command(BaseCommand):
    help = (
        "One-off seed: import the 7 projects that used to live as `projects.*` "
        "keys in the frontend's translation.json into Project/ProjectTranslation. "
        "Safe to re-run — it upserts."
    )

    def handle(self, *args, **options):
        entries_by_language = json.loads(DATA_PATH.read_text(encoding="utf-8"))

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

        self.stdout.write(self.style.SUCCESS(f"Done: {created} created, {updated} updated."))
