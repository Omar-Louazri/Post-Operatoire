from django.urls import path

from core.views import HealthView, RecoveryPlanDetailView, RecoveryPlanListView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("recovery-plans/", RecoveryPlanListView.as_view(), name="recovery-plan-list"),
    path(
        "recovery-plans/<slug:slug>/",
        RecoveryPlanDetailView.as_view(),
        name="recovery-plan-detail",
    ),
]
