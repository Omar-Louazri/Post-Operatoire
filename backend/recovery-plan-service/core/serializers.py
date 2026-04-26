from rest_framework import serializers

from core.models import RecoveryPlanTemplate


class RecoveryPlanTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryPlanTemplate
        fields = (
            "id",
            "slug",
            "title",
            "specialty",
            "surgery_type",
            "target_duration_days",
            "overview",
            "weekly_objectives",
            "self_check_prompts",
            "care_team_roles",
        )
