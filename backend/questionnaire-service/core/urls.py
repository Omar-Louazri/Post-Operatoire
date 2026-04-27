from django.urls import path

from core.views import (
    HealthView,
    QuestionnaireListCreateView,
    QuestionnaireTemplateDetailView,
    SubmissionDetailView,
    SubmissionListCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("questionnaires/", QuestionnaireListCreateView.as_view(), name="questionnaire-list"),
    path("questionnaires/<slug:slug>/", QuestionnaireTemplateDetailView.as_view(), name="questionnaire-detail"),
    path("submissions/", SubmissionListCreateView.as_view(), name="submission-list-create"),
    path("submissions/<int:pk>/", SubmissionDetailView.as_view(), name="submission-detail"),
]
