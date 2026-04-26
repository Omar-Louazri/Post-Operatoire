from django.conf import settings
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import CareCoordinationTask, CareTeamContact
from core.serializers import CareCoordinationTaskSerializer, CareTeamContactSerializer


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class CareTeamListView(ListAPIView):
    queryset = CareTeamContact.objects.all()
    serializer_class = CareTeamContactSerializer


class CareTaskListView(ListAPIView):
    queryset = CareCoordinationTask.objects.all()
    serializer_class = CareCoordinationTaskSerializer

# Create your views here.
