from django.conf import settings
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import RecoveryPlanTemplate
from core.serializers import RecoveryPlanTemplateSerializer


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class RecoveryPlanListView(ListAPIView):
    queryset = RecoveryPlanTemplate.objects.all()
    serializer_class = RecoveryPlanTemplateSerializer


class RecoveryPlanDetailView(RetrieveAPIView):
    queryset = RecoveryPlanTemplate.objects.all()
    serializer_class = RecoveryPlanTemplateSerializer
    lookup_field = "slug"

# Create your views here.
