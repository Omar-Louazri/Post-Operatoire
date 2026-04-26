from django.conf import settings
from rest_framework.generics import ListAPIView, ListCreateAPIView
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


class QuestionnaireListView(ListAPIView):
    queryset = QuestionnaireTemplate.objects.all()
    serializer_class = QuestionnaireTemplateSerializer


class SubmissionListCreateView(ListCreateAPIView):
    queryset = QuestionnaireSubmission.objects.select_related("template").all()
    serializer_class = QuestionnaireSubmissionSerializer

# Create your views here.
