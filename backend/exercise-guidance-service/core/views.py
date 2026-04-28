import uuid

from django.conf import settings
from django.utils.text import slugify
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import ExerciseProtocol
from core.serializers import ExerciseProtocolSerializer


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class ExerciseListCreateView(ListCreateAPIView):
    queryset = ExerciseProtocol.objects.all()
    serializer_class = ExerciseProtocolSerializer

    def perform_create(self, serializer):
        slug = serializer.validated_data.get("slug") or ""
        if not slug:
            base = slugify(serializer.validated_data.get("title", "exercise"))
            slug = f"{base}-{uuid.uuid4().hex[:6]}"
        serializer.save(slug=slug)


class ExerciseDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ExerciseProtocol.objects.all()
    serializer_class = ExerciseProtocolSerializer
    lookup_field = "slug"
