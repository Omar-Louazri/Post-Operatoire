from rest_framework import serializers

from core.models import AlertAssessment, AlertRule


class AlertRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertRule
        fields = (
            "id",
            "code",
            "title",
            "severity",
            "trigger_conditions",
            "immediate_action",
        )


class AlertAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertAssessment
        fields = (
            "id",
            "patient_code",
            "pain_level",
            "has_fever",
            "bleeding_level",
            "swelling_level",
            "notes",
            "computed_severity",
            "triggered_rules",
            "care_recommendation",
            "created_at",
        )


class AlertEvaluationSerializer(serializers.Serializer):
    patient_code = serializers.CharField(max_length=50)
    pain_level = serializers.IntegerField(min_value=0, max_value=10)
    has_fever = serializers.BooleanField()
    bleeding_level = serializers.ChoiceField(
        choices=("none", "light", "moderate", "severe")
    )
    swelling_level = serializers.IntegerField(min_value=0, max_value=3)
    notes = serializers.CharField(allow_blank=True, required=False)
