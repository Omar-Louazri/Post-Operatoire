from django.conf import settings
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import ExerciseProtocol
from core.serializers import ExerciseProtocolSerializer


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class ExerciseListView(ListAPIView):
    queryset = ExerciseProtocol.objects.all()
    serializer_class = ExerciseProtocolSerializer


class ExerciseDetailView(RetrieveAPIView):
    queryset = ExerciseProtocol.objects.all()
    serializer_class = ExerciseProtocolSerializer
    lookup_field = "slug"

# Create your views here.
