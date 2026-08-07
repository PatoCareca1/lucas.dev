from django.db import models


class Guide(models.Model):
    """One chapter of the Guides track, in one language.

    Mirrors the frontmatter of the markdown files that used to live in
    `frontend/src/content/guides/{pt,en}/*.md` — one row per (slug, language),
    same as there used to be one file per language. `body` is the raw
    Markdown content (no frontmatter), rendered client-side with
    `react-markdown`.
    """

    class Level(models.TextChoices):
        INICIANTE = "iniciante", "Iniciante"
        INTERMEDIARIO = "intermediario", "Intermediário"

    class Language(models.TextChoices):
        PT = "pt", "Português"
        EN = "en", "English"

    slug = models.SlugField(max_length=140)
    language = models.CharField(max_length=5, choices=Language.choices)
    chapter = models.PositiveIntegerField()

    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=Level.choices)

    stack = models.JSONField(default=list, blank=True, help_text="Lista de tecnologias, ex: [\"Python\", \"Django\"]")
    prerequisites = models.JSONField(default=list, blank=True)
    not_needed = models.JSONField(default=list, blank=True)

    reading_time = models.PositiveIntegerField(help_text="Minutos de leitura")

    published = models.BooleanField(default=False)
    published_at = models.DateField(null=True, blank=True)
    updated_at = models.DateField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True, help_text="Data prevista, para capítulos ainda não publicados")
    repo_url = models.URLField(null=True, blank=True)

    body = models.TextField(blank=True, help_text="Conteúdo em Markdown")

    class Meta:
        ordering = ["chapter"]
        unique_together = ("slug", "language")

    def __str__(self) -> str:
        return f"{self.chapter:02d} · {self.title} ({self.language})"


class GuideFeedback(models.Model):
    """A reader's 👍/👎 + optional note, submitted from the guide article page."""

    class Verdict(models.TextChoices):
        HELPFUL = "helpful", "Ajudou"
        MISSING = "missing", "Faltou algo"

    guide = models.ForeignKey(Guide, on_delete=models.CASCADE, related_name="feedback_entries")
    verdict = models.CharField(max_length=10, choices=Verdict.choices)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.guide.slug} · {self.verdict} · {self.created_at:%Y-%m-%d}"
