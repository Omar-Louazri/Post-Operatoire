import uuid

from django.conf import settings
from django.utils.text import slugify
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import QuestionnaireSubmission, QuestionnaireTemplate
from core.serializers import (
    QuestionnaireSubmissionSerializer,
    QuestionnaireTemplateSerializer,
)


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class QuestionnaireListCreateView(ListCreateAPIView):
    queryset = QuestionnaireTemplate.objects.all()
    serializer_class = QuestionnaireTemplateSerializer

    def perform_create(self, serializer):
        slug = serializer.validated_data.get("slug") or ""
        if not slug:
            base = slugify(serializer.validated_data.get("title", "questionnaire"))
            slug = f"{base}-{uuid.uuid4().hex[:6]}"
        serializer.save(slug=slug)


class QuestionnaireTemplateDetailView(RetrieveUpdateDestroyAPIView):
    queryset = QuestionnaireTemplate.objects.all()
    serializer_class = QuestionnaireTemplateSerializer
    lookup_field = "slug"


class SubmissionListCreateView(ListCreateAPIView):
    queryset = QuestionnaireSubmission.objects.select_related("template").all()
    serializer_class = QuestionnaireSubmissionSerializer


class SubmissionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = QuestionnaireSubmission.objects.select_related("template").all()
    serializer_class = QuestionnaireSubmissionSerializer

# Create your views here.
