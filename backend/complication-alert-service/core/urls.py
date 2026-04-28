from django.urls import path

from core.views import (
    AlertAssessmentDetailView,
    AlertAssessmentListView,
    AlertEvaluationView,
    AlertRuleDetailView,
    AlertRuleListCreateView,
    HealthView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("alert-rules/", AlertRuleListCreateView.as_view(), name="alert-rule-list"),
    path("alert-rules/<str:code>/", AlertRuleDetailView.as_view(), name="alert-rule-detail"),
    path("alerts/", AlertAssessmentListView.as_view(), name="alert-list"),
    path("alerts/evaluate/", AlertEvaluationView.as_view(), name="alert-evaluate"),
    path("alerts/<int:pk>/", AlertAssessmentDetailView.as_view(), name="alert-detail"),
]
