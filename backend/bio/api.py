from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from django.http import Http404
from .schemas import ProjectSchema

router = Router()

# Hardcoded mock data for demonstration
MOCK_PROJECTS = {
    "plp": {
        "slug": "plp",
        "title": "PLP (Pricing & Promotions)",
        "short_desc": "Microsserviço de precisão para cálculo de preços e promoções em tempo real.",
        "challenge": "O sistema legado de precificação monolítico sofria de gargalos de performance durante eventos de alto tráfego (ex: Black Friday), causando lentidão no checkout e inconsistência de preços entre plataforma web e mobile.",
        "technical_solution": "Desenvolvimento de um microsserviço dedicado e altamente escalável usando Python e FastAPI/Django Ninja. Implementou-se um cache agressivo em Redis para regras de promoção complexas e integração via mensageria (RabbitMQ/Kafka) para reatividade em tempo real. A arquitetura foi desenhada para isolamento de dados e deploy independente.",
        "results": [
            "Redução de 70% no tempo de latência do cálculo de carrinho.",
            "Zero downtime durante picos de vendas sazonais.",
            "Desacoplamento que permitiu testes unitários robustos e CI/CD rápido.",
        ],
        "tech_stack": [
            "Python",
            "Django Ninja",
            "Redis",
            "RabbitMQ",
            "PostgreSQL",
            "Docker",
        ],
    },
    "prp": {
        "slug": "prp",
        "title": "PRP (Product Review Platform)",
        "short_desc": "Plataforma de avaliações processando alto volume de dados de produtos.",
        "challenge": "A loja precisava de um sistema próprio de reviews que aguentasse alto volume de escritas simultâneas e leitura extrememente rápida para não bloquear o carregamento das páginas de produto, além de filtros de moderação automática preventivos.",
        "technical_solution": "Arquitetura orientada a eventos. O Backend recebia as reviews e enfileirava o processamento (Celery). Bancos NoSQL (MongoDB/ElasticSearch) foram utilizados para garantir a leitura paginada em milissegundos. Webhooks foram criados para notificar moderação quando vocabulário inadequado era detectado.",
        "results": [
            "Escalabilidade horizontal absorvendo milhões de requests/dia.",
            "Entrega de reviews P99 < 50ms na página do produto.",
            "Sistema de moderação cortou 95% do spam automaticamente.",
        ],
        "tech_stack": ["Python", "Django", "Celery", "ElasticSearch", "MongoDB", "AWS"],
    },
}


@router.get("/projects", response=List[ProjectSchema])
def list_projects(request):
    """Retorna uma lista de todos os projetos em case studies."""
    return list(MOCK_PROJECTS.values())


@router.get("/projects/{slug}", response=ProjectSchema)
def get_project(request, slug: str):
    """Retorna o detalhe de um projeto específico."""
    project = MOCK_PROJECTS.get(slug.lower())
    if not project:
        raise Http404("Project not found")
    return project
