from django.urls import path

from core.views import ExerciseDetailView, ExerciseListView, HealthView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("exercises/", ExerciseListView.as_view(), name="exercise-list"),
    path("exercises/<slug:slug>/", ExerciseDetailView.as_view(), name="exercise-detail"),
]
