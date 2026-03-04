from typing import List, Dict
from ninja import Schema


class ProjectSchema(Schema):
    slug: str
    title: str
    short_desc: str
    challenge: str
    technical_solution: str
    results: List[str]
    tech_stack: List[str]
