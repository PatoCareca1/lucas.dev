from django.shortcuts import get_object_or_404
from django_ratelimit.decorators import ratelimit
from ninja import Router

from .models import Guide, GuideFeedback
from .schemas import GuideFeedbackIn, GuideFeedbackOut, GuideOut

router = Router(tags=["guides"])

MAX_NOTE_LENGTH = 2000


def normalize_language(language: str) -> str:
    return Guide.Language.PT if language.lower().startswith("pt") else Guide.Language.EN


@router.get("", response=list[GuideOut])
def list_guides(request, language: str = "pt"):
    """All published chapters in one language, body included.

    Fetched once by the frontend and kept in memory — search and "related
    guides" are computed client-side over this list, same as before.
    """
    return Guide.objects.filter(language=normalize_language(language), published=True)


@router.get("/{slug}", response=GuideOut)
def get_guide(request, slug: str, language: str = "pt"):
    return get_object_or_404(
        Guide, slug=slug, language=normalize_language(language), published=True
    )


@router.post("/{slug}/feedback", response={201: GuideFeedbackOut})
@ratelimit(key="ip", rate="10/h", method="POST", block=True)
def submit_feedback(request, slug: str, payload: GuideFeedbackIn, language: str = "pt"):
    guide = get_object_or_404(
        Guide, slug=slug, language=normalize_language(language), published=True
    )
    GuideFeedback.objects.create(
        guide=guide,
        verdict=payload.verdict,
        note=payload.note.strip()[:MAX_NOTE_LENGTH],
    )
    return 201, {"status": "ok"}
