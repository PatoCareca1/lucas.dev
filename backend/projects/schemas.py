from typing import Optional

from ninja import Schema


class SolutionDetailOut(Schema):
    label: str
    text: str


class ProjectOut(Schema):
    """Flattened view of Project + ProjectTranslation for one language —
    mirrors what `frontend/src/components/ProjectModal.tsx` used to read via
    `t('projects.<slug>.<field>')`."""

    slug: str
    title: str
    tag: str
    short_desc: str
    challenge: str
    solution: str
    solution_details: dict[str, SolutionDetailOut]
    impact: list[str]
    tech_stack: list[str]
    site_url: Optional[str] = None
    repo_url: Optional[str] = None
    disclaimer: str = ""
    quote: str = ""
    link_label: str = ""
