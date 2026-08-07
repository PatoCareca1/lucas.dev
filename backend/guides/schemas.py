from datetime import date
from typing import Literal, Optional

from ninja import Schema


class GuideOut(Schema):
    """Mirrors `frontend/src/types/guide.ts` (`Guide`), field names in snake_case —
    the frontend API client maps this onto the camelCase shape the UI expects."""

    slug: str
    language: str
    chapter: int
    title: str
    description: str
    level: str
    stack: list[str]
    prerequisites: list[str]
    not_needed: list[str]
    reading_time: int
    published: bool
    published_at: Optional[date] = None
    updated_at: Optional[date] = None
    release_date: Optional[date] = None
    repo_url: Optional[str] = None
    body: str


class GuideFeedbackIn(Schema):
    verdict: Literal["helpful", "missing"]
    note: str = ""


class GuideFeedbackOut(Schema):
    status: Literal["ok"] = "ok"
