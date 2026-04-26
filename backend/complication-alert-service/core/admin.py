from django.contrib import admin

from core.models import AlertAssessment, AlertRule


@admin.register(AlertRule)
class AlertRuleAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "severity")
    list_filter = ("severity",)
    search_fields = ("code", "title")


@admin.register(AlertAssessment)
class AlertAssessmentAdmin(admin.ModelAdmin):
    list_display = ("patient_code", "computed_severity", "pain_level", "created_at")
    list_filter = ("computed_severity", "has_fever", "bleeding_level")
    search_fields = ("patient_code",)

# Register your models here.
