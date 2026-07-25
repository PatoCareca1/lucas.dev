---
slug: django-zero-ao-deploy
chapter: 1
title: Django do zero ao deploy
description: Ambiente, projeto, banco, estáticos e um deploy real. O capítulo mais longo da trilha e o único que você precisa terminar antes dos outros.
level: iniciante
stack: [Python, Django, Docker, Postgres]
prerequisites:
  - 'Python 3.11 ou superior, com `python --version` respondendo no terminal.'
  - 'Linha de comando sem susto: navegar diretórios, editar arquivos, exportar variáveis de ambiente.'
  - 'Docker Engine 24+ ou Docker Desktop instalado e rodando.'
notNeeded: ['experiência com Django', 'SQL avançado', 'Kubernetes']
readingTime: 24
published: true
publishedAt: 2026-05-12
updatedAt: 2026-07-10
releaseDate: null
repoUrl: https://github.com/lucasdaniel/django-zero-ao-deploy
---

A maior parte dos tutoriais de Django em português termina no momento em que o servidor de desenvolvimento sobe. Este começa ali e segue até a aplicação atendendo requisições de fora da sua máquina, com Postgres, Gunicorn e um processo de deploy que você consegue repetir.

## Ambiente: venv e dependências fixadas

Instalar Django com `sudo pip install` é a primeira dívida técnica do projeto. Um ambiente virtual por projeto isola versões e torna o build reproduzível dentro do container mais adiante.

```bash
python -m venv .venv
source .venv/bin/activate
pip install "django==5.0.*" "psycopg[binary]" gunicorn whitenoise
pip freeze > requirements.txt
django-admin startproject config .
```

O ponto no fim do `startproject` evita a pasta duplicada que atrapalha o `COPY` do Dockerfile depois.

## O projeto que já nasce dockerizado

Container desde o primeiro dia significa que a diferença entre a sua máquina e o servidor deixa de ser uma surpresa de sexta-feira.

```dockerfile:Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
```

> [!note]
> `--workers 3` não é número mágico. Comece com `2 × núcleos + 1` e ajuste medindo, não adivinhando.

## Postgres desde o primeiro commit

SQLite é confortável e mente para você. Constraints, tipos, transações concorrentes e ordenação se comportam de outra forma em produção.

- Migrations que passam no SQLite e falham no Postgres são um clássico de sexta à noite.
- `JSONField`, índices parciais e `select_for_update` só existem de verdade no Postgres.
- Ordenação com acento e busca por texto dependem de collation — algo que o SQLite ignora.

> [!warning]
> Com `ALLOWED_HOSTS` vazio em produção, o Django responde 400 antes de qualquer log útil. Configure na primeira variável de ambiente que você criar.

## Configuração por ambiente

Um pacote `settings/` com `base`, `dev` e `prod` deixa explícito o que muda entre ambientes. Segredo ausente derruba o boot na hora — e isso é bom.

```python:config/settings/base.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")
```

## Estáticos, Gunicorn e Whitenoise

Com `DEBUG=False` o Django deixa de servir estáticos. Whitenoise resolve com uma linha de middleware.

> [!pitfall]
> Esquecer o `collectstatic` no build da imagem gera um container que sobe, responde e serve a aplicação sem nenhum CSS.

## Deploy: build, migrate, health check

Migrations aditivas antes do switch de tráfego, remoção de coluna só no deploy seguinte.

## O que fica de fora, por enquanto

Cache, filas e observabilidade têm capítulo próprio. Terminar este já coloca a aplicação no ar.
