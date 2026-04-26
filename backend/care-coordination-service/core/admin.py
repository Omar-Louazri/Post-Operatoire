from django.contrib import admin

from core.models import CareCoordinationTask, CareTeamContact


@admin.register(CareTeamContact)
class CareTeamContactAdmin(admin.ModelAdmin):
    list_display = ("full_name", "role", "specialty", "is_primary")
    list_filter = ("role", "specialty", "is_primary")
    search_fields = ("full_name", "email", "role")


@admin.register(CareCoordinationTask)
class CareCoordinationTaskAdmin(admin.ModelAdmin):
    list_display = ("patient_code", "title", "responsible_role", "priority", "due_at")
    list_filter = ("status", "priority", "responsible_role")
    search_fields = ("patient_code", "title", "summary")

# Register your models here.
