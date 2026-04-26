from django.urls import path

from core.views import (
    AlertAssessmentListView,
    AlertEvaluationView,
    AlertRuleListView,
    HealthView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("alert-rules/", AlertRuleListView.as_view(), name="alert-rule-list"),
    path("alerts/", AlertAssessmentListView.as_view(), name="alert-list"),
    path("alerts/evaluate/", AlertEvaluationView.as_view(), name="alert-evaluate"),
]
