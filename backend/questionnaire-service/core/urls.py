from django.urls import path

from core.views import HealthView, QuestionnaireListView, SubmissionListCreateView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("questionnaires/", QuestionnaireListView.as_view(), name="questionnaire-list"),
    path("submissions/", SubmissionListCreateView.as_view(), name="submission-list-create"),
]
