from django.contrib import admin

from core.models import ExerciseProtocol


@admin.register(ExerciseProtocol)
class ExerciseProtocolAdmin(admin.ModelAdmin):
    list_display = ("title", "phase", "difficulty", "duration_minutes")
    list_filter = ("phase", "difficulty")
    search_fields = ("title", "slug", "summary")

# Register your models here.
