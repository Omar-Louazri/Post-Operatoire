from rest_framework import serializers

from core.models import RecoveryPlanTemplate


class RecoveryPlanTemplateSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = RecoveryPlanTemplate
        fields = (
            "id",
            "slug",
            "patient_code",
            "title",
            "specialty",
            "surgery_type",
            "target_duration_days",
            "start_date",
            "overview",
            "weekly_objectives",
            "self_check_prompts",
            "care_team_roles",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
