from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Project, ProjectTranslation
from .schemas import ProjectOut

router = Router(tags=["projects"])


def normalize_language(language: str) -> str:
    return (
        ProjectTranslation.Language.PT
        if language.lower().startswith("pt")
        else ProjectTranslation.Language.EN
    )


def _serialize(translation: ProjectTranslation) -> dict:
    project = translation.project
    return {
        "slug": project.slug,
        "tech_stack": project.tech_stack,
        "site_url": project.site_url,
        "repo_url": project.repo_url,
        "title": translation.title,
        "tag": translation.tag,
        "short_desc": translation.short_desc,
        "challenge": translation.challenge,
        "solution": translation.solution,
        "solution_details": translation.solution_details,
        "impact": translation.impact,
        "disclaimer": translation.disclaimer,
        "quote": translation.quote,
        "link_label": translation.link_label,
    }


@router.get("", response=list[ProjectOut])
def list_projects(request, language: str = "pt"):
    translations = (
        ProjectTranslation.objects.filter(language=normalize_language(language))
        .select_related("project")
        .order_by("project__order")
    )
    return [_serialize(translation) for translation in translations]


@router.get("/{slug}", response=ProjectOut)
def get_project(request, slug: str, language: str = "pt"):
    translation = get_object_or_404(
        ProjectTranslation.objects.select_related("project"),
        project__slug=slug,
        language=normalize_language(language),
    )
    return _serialize(translation)
