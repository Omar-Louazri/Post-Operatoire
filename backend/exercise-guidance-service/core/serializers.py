from rest_framework import serializers

from core.models import ExerciseProtocol


class ExerciseProtocolSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProtocol
        fields = (
            "id",
            "slug",
            "title",
            "phase",
            "difficulty",
            "duration_minutes",
            "summary",
            "equipment",
            "instructions",
            "validation_criteria",
            "media_url",
        )
