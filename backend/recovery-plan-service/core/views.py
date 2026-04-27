import uuid

from django.conf import settings
from django.utils.text import slugify
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import RecoveryPlanTemplate
from core.serializers import RecoveryPlanTemplateSerializer


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class RecoveryPlanListCreateView(ListCreateAPIView):
    serializer_class = RecoveryPlanTemplateSerializer

    def get_queryset(self):
        qs = RecoveryPlanTemplate.objects.all()
        patient_code = self.request.query_params.get("patient_code")
        if patient_code:
            qs = qs.filter(patient_code=patient_code)
        return qs

    def perform_create(self, serializer):
        slug = serializer.validated_data.get("slug") or ""
        if not slug:
            base = slugify(serializer.validated_data.get("title", "plan"))
            slug = f"{base}-{uuid.uuid4().hex[:6]}"
        serializer.save(slug=slug)


class RecoveryPlanDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RecoveryPlanTemplate.objects.all()
    serializer_class = RecoveryPlanTemplateSerializer
    lookup_field = "slug"
