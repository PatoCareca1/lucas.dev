from django import forms
from django.contrib import admin

from .models import Project, ProjectTranslation


class ProjectTranslationForm(forms.ModelForm):
    class Meta:
        model = ProjectTranslation
        fields = "__all__"
        widgets = {
            "short_desc": forms.Textarea(attrs={"rows": 2}),
            "challenge": forms.Textarea(attrs={"rows": 3}),
            "solution": forms.Textarea(attrs={"rows": 3}),
            "disclaimer": forms.Textarea(attrs={"rows": 2}),
            "quote": forms.Textarea(attrs={"rows": 2}),
        }


class ProjectTranslationInline(admin.StackedInline):
    model = ProjectTranslation
    form = ProjectTranslationForm
    extra = 0
    min_num = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("slug", "order", "site_url", "repo_url")
    search_fields = ("slug",)
    ordering = ("order", "slug")
    inlines = [ProjectTranslationInline]
