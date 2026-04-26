from rest_framework import serializers

from core.models import QuestionnaireSubmission, QuestionnaireTemplate


class QuestionnaireTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireTemplate
        fields = (
            "id",
            "slug",
            "title",
            "audience",
            "cadence",
            "intro_text",
            "medically_validated_by",
            "questions",
        )


class QuestionnaireSubmissionSerializer(serializers.ModelSerializer):
    template = QuestionnaireTemplateSerializer(read_only=True)
    template_slug = serializers.SlugRelatedField(
        source="template",
        slug_field="slug",
        queryset=QuestionnaireTemplate.objects.all(),
        write_only=True,
    )

    class Meta:
        model = QuestionnaireSubmission
        fields = (
            "id",
            "patient_code",
            "template",
            "template_slug",
            "scheduled_for",
            "submitted_at",
            "status",
            "answers",
            "pain_score",
            "free_text",
        )
        read_only_fields = ("submitted_at",)

    def validate_pain_score(self, value: int) -> int:
        if value < 0 or value > 10:
            raise serializers.ValidationError("Pain score must be between 0 and 10.")
        return value
