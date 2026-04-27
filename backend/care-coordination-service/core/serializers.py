from rest_framework import serializers

from core.models import CareCoordinationTask, CareTeamContact, PatientCareAssignment


class CareTeamContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTeamContact
        fields = ("id", "full_name", "role", "specialty", "email", "phone", "availability", "is_primary")


class PatientCareAssignmentSerializer(serializers.ModelSerializer):
    contact = CareTeamContactSerializer(read_only=True)
    contact_id = serializers.PrimaryKeyRelatedField(
        source="contact",
        queryset=CareTeamContact.objects.all(),
        write_only=True,
    )

    class Meta:
        model = PatientCareAssignment
        fields = ("id", "patient_code", "contact", "contact_id", "role_on_case", "notes", "assigned_at")
        read_only_fields = ("id", "assigned_at")


class CareCoordinationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareCoordinationTask
        fields = ("id", "patient_code", "title", "responsible_role", "status", "priority", "due_at", "summary", "channel")
        read_only_fields = ("id",)
