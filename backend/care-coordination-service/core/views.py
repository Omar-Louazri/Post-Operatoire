from django.conf import settings
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import CareCoordinationTask, CareTeamContact, PatientCareAssignment
from core.serializers import (
    CareCoordinationTaskSerializer,
    CareTeamContactSerializer,
    PatientCareAssignmentSerializer,
)


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class CareTeamListCreateView(ListCreateAPIView):
    queryset = CareTeamContact.objects.all()
    serializer_class = CareTeamContactSerializer


class CareTeamDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CareTeamContact.objects.all()
    serializer_class = CareTeamContactSerializer


class PatientCareAssignmentListCreateView(ListCreateAPIView):
    serializer_class = PatientCareAssignmentSerializer

    def get_queryset(self):
        qs = PatientCareAssignment.objects.select_related("contact").all()
        patient_code = self.request.query_params.get("patient_code")
        if patient_code:
            qs = qs.filter(patient_code=patient_code)
        return qs


class PatientCareAssignmentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = PatientCareAssignment.objects.select_related("contact").all()
    serializer_class = PatientCareAssignmentSerializer


class CareTaskListCreateView(ListCreateAPIView):
    serializer_class = CareCoordinationTaskSerializer

    def get_queryset(self):
        qs = CareCoordinationTask.objects.all()
        patient_code = self.request.query_params.get("patient_code")
        if patient_code:
            qs = qs.filter(patient_code=patient_code)
        return qs


class CareTaskDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CareCoordinationTask.objects.all()
    serializer_class = CareCoordinationTaskSerializer
