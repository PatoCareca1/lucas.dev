import json

import pytest
from django.core.management import call_command

from projects.management.commands.seed_projects import DATA_PATH, PROJECT_ORDER
from projects.models import Project, ProjectTranslation

pytestmark = pytest.mark.django_db


def make_project(slug="plp", order=0, **overrides):
    project = Project.objects.create(
        slug=slug, order=order, tech_stack=["Python", "Django"], repo_url=None
    )
    for language in (ProjectTranslation.Language.PT, ProjectTranslation.Language.EN):
        ProjectTranslation.objects.create(
            project=project,
            language=language,
            **{
                "title": f"{slug}-{language}",
                "tag": "Backend",
                "short_desc": "Descrição curta",
                "challenge": "Desafio",
                "solution": "Solução",
                "solution_details": {},
                "impact": [],
                **overrides,
            },
        )
    return project


class TestProjectsApi:
    def test_list_returns_one_entry_per_project_in_display_order(self, client):
        make_project(slug="prp", order=1)
        make_project(slug="plp", order=0)

        response = client.get("/api/projects?language=pt")

        assert response.status_code == 200
        assert [project["slug"] for project in response.json()] == ["plp", "prp"]

    def test_list_returns_the_translation_of_the_requested_language(self, client):
        make_project()

        response = client.get("/api/projects?language=en-GB")

        assert [project["title"] for project in response.json()] == ["plp-en"]

    def test_list_flattens_project_and_translation_fields(self, client):
        make_project()

        project = client.get("/api/projects").json()[0]

        assert project["tech_stack"] == ["Python", "Django"]
        assert project["tag"] == "Backend"
        assert project["site_url"] is None

    def test_detail_returns_the_requested_project(self, client):
        make_project()

        response = client.get("/api/projects/plp")

        assert response.status_code == 200
        assert response.json()["title"] == "plp-pt"

    def test_detail_returns_404_for_unknown_slug(self, client):
        assert client.get("/api/projects/nao-existe").status_code == 404

    def test_detail_returns_404_when_the_translation_is_missing(self, client):
        project = make_project()
        project.translations.filter(language=ProjectTranslation.Language.EN).delete()

        assert client.get("/api/projects/plp?language=en").status_code == 404


class TestSeedProjects:
    def test_seed_imports_every_project_in_both_languages(self):
        call_command("seed_projects")

        assert Project.objects.count() == len(PROJECT_ORDER)
        assert ProjectTranslation.objects.count() == len(PROJECT_ORDER) * 2

    def test_seed_preserves_the_declared_display_order(self):
        call_command("seed_projects")

        assert list(Project.objects.values_list("slug", flat=True)) == PROJECT_ORDER

    def test_seed_fills_the_translated_fields(self):
        entries = json.loads(DATA_PATH.read_text(encoding="utf-8"))

        call_command("seed_projects")

        translation = ProjectTranslation.objects.get(project__slug="sapo", language="pt")
        assert translation.title == entries["pt"]["sapo"]["title"]
        assert translation.challenge

    def test_seed_is_idempotent_and_overwrites_local_edits(self):
        call_command("seed_projects")
        ProjectTranslation.objects.filter(project__slug="sapo", language="pt").update(
            title="Alterado"
        )

        call_command("seed_projects")

        assert Project.objects.count() == len(PROJECT_ORDER)
        assert ProjectTranslation.objects.count() == len(PROJECT_ORDER) * 2
        assert (
            ProjectTranslation.objects.get(project__slug="sapo", language="pt").title != "Alterado"
        )
