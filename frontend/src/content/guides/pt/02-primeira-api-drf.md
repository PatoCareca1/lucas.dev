---
slug: primeira-api-drf
chapter: 2
title: Sua primeira API com DRF
description: Serializers, viewsets, autenticação por token e paginação, com testes desde o primeiro endpoint.
level: intermediario
stack: [Django, DRF, Postgres]
prerequisites:
  - 'O capítulo 1 terminado, com a aplicação servindo em produção.'
  - 'Um modelo de dados já migrado no Postgres.'
notNeeded: ['GraphQL', 'WebSockets', 'Kubernetes']
readingTime: 18
published: true
publishedAt: 2026-06-18
updatedAt: 2026-07-02
releaseDate: null
repoUrl: https://github.com/lucasdaniel/primeira-api-drf
---

Uma API que devolve JSON é fácil. Uma API que continua fácil de mudar depois de seis meses é outro assunto — e é sobre isso que este capítulo trata.

## Serializers que não escondem regra de negócio

Validação no serializer, regra no modelo ou no serviço. A viewset fica magra.

```python:api/serializers.py
from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['slug', 'created_at']
```

> [!note]
> `read_only_fields` evita o endpoint aceitar campos que ele não deveria escrever. É a defesa mais barata contra mass assignment.

## Paginação e filtros sem N+1

`select_related` e `prefetch_related` são parte do contrato do endpoint, não otimização posterior.

```python:api/views.py
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.select_related('owner').prefetch_related('tags')
```

> [!pitfall]
> Testar a listagem com três registros esconde o N+1. Popule o banco de teste com algumas centenas antes de confiar no tempo de resposta.

## Autenticação por token

Token simples resolve o primeiro cliente. JWT entra quando houver mais de um consumidor e expiração virar requisito.

## Testes desde o primeiro endpoint

Um teste por status code que o endpoint promete devolver. Se ele pode responder 404, existe um teste para o 404.
