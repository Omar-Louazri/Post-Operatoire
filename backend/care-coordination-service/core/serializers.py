from rest_framework import serializers

from core.models import CareCoordinationTask, CareTeamContact


class CareTeamContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTeamContact
        fields = (
            "id",
            "full_name",
            "role",
            "specialty",
            "email",
            "phone",
            "availability",
            "is_primary",
        )


class CareCoordinationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareCoordinationTask
        fields = (
            "id",
            "patient_code",
            "title",
            "responsible_role",
            "status",
            "priority",
            "due_at",
            "summary",
            "channel",
        )
