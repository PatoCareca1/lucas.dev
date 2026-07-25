---
slug: primeira-api-drf
chapter: 2
title: Your first API with DRF
description: Serializers, viewsets, token authentication and pagination, with tests from the very first endpoint.
level: intermediario
stack: [Django, DRF, Postgres]
prerequisites:
  - 'Chapter 1 finished, with the application serving in production.'
  - 'A data model already migrated on Postgres.'
notNeeded: ['GraphQL', 'WebSockets', 'Kubernetes']
readingTime: 18
published: true
publishedAt: 2026-06-18
updatedAt: 2026-07-02
releaseDate: null
repoUrl: https://github.com/lucasdaniel/primeira-api-drf
---

An API that returns JSON is easy. An API that is still easy to change six months later is another matter — and that is what this chapter is about.

## Serializers that do not hide business rules

Validation in the serializer, rules in the model or in the service. The viewset stays thin.

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
> `read_only_fields` stops the endpoint from accepting fields it should never write. It is the cheapest defense against mass assignment.

## Pagination and filters without N+1

`select_related` and `prefetch_related` are part of the endpoint's contract, not a later optimization.

```python:api/views.py
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.select_related('owner').prefetch_related('tags')
```

> [!pitfall]
> Testing the list endpoint with three records hides the N+1. Seed the test database with a few hundred before trusting the response time.

## Token authentication

A simple token solves the first client. JWT comes in when there is more than one consumer and expiry becomes a requirement.

## Tests from the first endpoint

One test per status code the endpoint promises to return. If it can answer 404, there is a test for the 404.
