from django.contrib import admin

from core.models import QuestionnaireSubmission, QuestionnaireTemplate


@admin.register(QuestionnaireTemplate)
class QuestionnaireTemplateAdmin(admin.ModelAdmin):
    list_display = ("title", "audience", "cadence", "medically_validated_by")
    search_fields = ("title", "slug", "audience")


@admin.register(QuestionnaireSubmission)
class QuestionnaireSubmissionAdmin(admin.ModelAdmin):
    list_display = ("patient_code", "template", "status", "pain_score", "submitted_at")
    list_filter = ("status", "template")
    search_fields = ("patient_code", "template__title")

# Register your models here.
