from django.db import models


class Project(models.Model):
    """A case-study project, language-neutral part.

    Fields that are identical in every language (the stack shown as badges,
    the links) live here; everything that's actually written prose lives in
    `ProjectTranslation`.
    """

    slug = models.SlugField(max_length=140, unique=True)
    tech_stack = models.JSONField(default=list, blank=True)
    site_url = models.URLField(null=True, blank=True)
    repo_url = models.URLField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0, help_text="Ordem de exibição na listagem")

    class Meta:
        ordering = ["order", "slug"]

    def __str__(self) -> str:
        return self.slug


class ProjectTranslation(models.Model):
    class Language(models.TextChoices):
        PT = "pt", "Português"
        EN = "en", "English"

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="translations")
    language = models.CharField(max_length=5, choices=Language.choices)

    title = models.CharField(max_length=200)
    tag = models.CharField(max_length=100)
    short_desc = models.TextField()
    challenge = models.TextField()
    solution = models.TextField()
    solution_details = models.JSONField(
        default=dict,
        blank=True,
        help_text='Mapa opcional, ex: {"apis": {"label": "APIs & Segurança", "text": "..."}}',
    )
    impact = models.JSONField(default=list, blank=True)

    disclaimer = models.TextField(blank=True)
    quote = models.TextField(blank=True)
    link_label = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["project__order"]
        unique_together = ("project", "language")

    def __str__(self) -> str:
        return f"{self.project.slug} ({self.language})"
