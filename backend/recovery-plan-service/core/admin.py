from django.contrib import admin

from core.models import RecoveryPlanTemplate


@admin.register(RecoveryPlanTemplate)
class RecoveryPlanTemplateAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "specialty",
        "surgery_type",
        "target_duration_days",
    )
    list_filter = ("specialty", "surgery_type")
    search_fields = ("title", "slug", "overview")

# Register your models here.
