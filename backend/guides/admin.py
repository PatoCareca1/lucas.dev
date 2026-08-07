from django import forms
from django.contrib import admin

from .models import Guide, GuideFeedback


class GuideAdminForm(forms.ModelForm):
    class Meta:
        model = Guide
        fields = "__all__"
        widgets = {
            "body": forms.Textarea(attrs={"rows": 30, "class": "vLargeTextField", "style": "font-family: monospace;"}),
            "description": forms.Textarea(attrs={"rows": 3}),
        }


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    form = GuideAdminForm
    list_display = ("chapter", "title", "language", "level", "published", "published_at", "updated_at")
    list_filter = ("language", "level", "published")
    search_fields = ("slug", "title", "description")
    ordering = ("language", "chapter")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("slug", "language", "chapter", "title", "description", "level")}),
        ("Metadados", {"fields": ("stack", "prerequisites", "not_needed", "reading_time", "repo_url")}),
        ("Publicação", {"fields": ("published", "published_at", "updated_at", "release_date")}),
        ("Conteúdo", {"fields": ("body",)}),
    )


@admin.register(GuideFeedback)
class GuideFeedbackAdmin(admin.ModelAdmin):
    list_display = ("guide", "verdict", "created_at")
    list_filter = ("verdict", "guide__language")
    search_fields = ("note", "guide__slug")
    readonly_fields = ("guide", "verdict", "note", "created_at")
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
