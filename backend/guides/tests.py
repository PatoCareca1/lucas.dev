import json

import pytest
from django.core.management import call_command

from guides.management.commands.seed_guides import DATA_PATH
from guides.models import Guide, GuideFeedback

pytestmark = pytest.mark.django_db


def make_guide(**overrides):
    defaults = {
        "slug": "django-zero-ao-deploy",
        "language": Guide.Language.PT,
        "chapter": 1,
        "title": "Django do zero ao deploy",
        "description": "Primeiro capítulo",
        "level": Guide.Level.INICIANTE,
        "reading_time": 12,
        "published": True,
        "body": "# Conteúdo",
    }
    return Guide.objects.create(**{**defaults, **overrides})


def post_feedback(client, slug, **payload):
    return client.post(
        f"/api/guides/{slug}/feedback",
        data=json.dumps({"verdict": "helpful", **payload}),
        content_type="application/json",
    )


class TestGuidesApi:
    def test_list_returns_only_published_guides_of_the_requested_language(self, client):
        make_guide()
        make_guide(slug="celery-background", chapter=3, published=False)
        make_guide(slug="django-zero-ao-deploy", language=Guide.Language.EN)

        response = client.get("/api/guides?language=pt")

        assert response.status_code == 200
        assert [guide["slug"] for guide in response.json()] == ["django-zero-ao-deploy"]

    def test_list_is_ordered_by_chapter(self, client):
        make_guide(slug="primeira-api-drf", chapter=2)
        make_guide(slug="django-zero-ao-deploy", chapter=1)

        response = client.get("/api/guides")

        assert [guide["chapter"] for guide in response.json()] == [1, 2]

    def test_list_accepts_regional_language_tags(self, client):
        make_guide(language=Guide.Language.EN, title="Django from zero to deploy")

        response = client.get("/api/guides?language=en-US")

        assert [guide["title"] for guide in response.json()] == ["Django from zero to deploy"]

    def test_detail_returns_the_full_body(self, client):
        make_guide(body="# Título\n\nParágrafo.")

        response = client.get("/api/guides/django-zero-ao-deploy")

        assert response.status_code == 200
        assert response.json()["body"] == "# Título\n\nParágrafo."

    def test_detail_hides_unpublished_guides(self, client):
        make_guide(published=False)

        assert client.get("/api/guides/django-zero-ao-deploy").status_code == 404

    def test_detail_returns_404_for_unknown_slug(self, client):
        assert client.get("/api/guides/nao-existe").status_code == 404


class TestGuideFeedbackApi:
    def test_feedback_is_persisted_against_the_guide(self, client):
        guide = make_guide()

        response = post_feedback(client, guide.slug, note="  faltou um exemplo  ")

        assert response.status_code == 201
        assert response.json() == {"status": "ok"}

        feedback = GuideFeedback.objects.get()
        assert feedback.guide == guide
        assert feedback.verdict == GuideFeedback.Verdict.HELPFUL
        assert feedback.note == "faltou um exemplo"

    def test_feedback_note_is_truncated(self, client):
        guide = make_guide()

        post_feedback(client, guide.slug, note="x" * 5000)

        assert len(GuideFeedback.objects.get().note) == 2000

    def test_feedback_rejects_an_unknown_verdict(self, client):
        guide = make_guide()

        response = post_feedback(client, guide.slug, verdict="maybe")

        assert response.status_code == 422
        assert not GuideFeedback.objects.exists()

    def test_feedback_is_rate_limited_by_ip(self, client):
        guide = make_guide()

        for _ in range(10):
            assert post_feedback(client, guide.slug).status_code == 201

        response = post_feedback(client, guide.slug)

        assert response.status_code == 429
        assert GuideFeedback.objects.count() == 10


class TestSeedGuides:
    def test_seed_imports_every_entry_from_the_bundled_json(self):
        entries = json.loads(DATA_PATH.read_text(encoding="utf-8"))

        call_command("seed_guides")

        assert Guide.objects.count() == len(entries)
        assert set(Guide.objects.values_list("language", flat=True)) == {"pt", "en"}

    def test_seed_maps_camel_case_fields_onto_the_model(self):
        call_command("seed_guides")

        guide = Guide.objects.get(slug="django-zero-ao-deploy", language="pt")
        assert guide.chapter == 1
        assert guide.published is True
        assert guide.reading_time > 0
        assert guide.body

    def test_seed_is_idempotent_and_overwrites_local_edits(self):
        call_command("seed_guides")
        Guide.objects.filter(slug="django-zero-ao-deploy", language="pt").update(title="Alterado")

        call_command("seed_guides")

        assert Guide.objects.count() == len(json.loads(DATA_PATH.read_text(encoding="utf-8")))
        assert Guide.objects.get(slug="django-zero-ao-deploy", language="pt").title != "Alterado"
