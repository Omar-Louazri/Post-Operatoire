from django.urls import path

from core.views import (
    CareTaskDetailView,
    CareTaskListCreateView,
    CareTeamDetailView,
    CareTeamListCreateView,
    HealthView,
    PatientCareAssignmentDetailView,
    PatientCareAssignmentListCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("care-team/", CareTeamListCreateView.as_view(), name="care-team-list"),
    path("care-team/<int:pk>/", CareTeamDetailView.as_view(), name="care-team-detail"),
    path("care-assignments/", PatientCareAssignmentListCreateView.as_view(), name="care-assignment-list"),
    path("care-assignments/<int:pk>/", PatientCareAssignmentDetailView.as_view(), name="care-assignment-detail"),
    path("care-tasks/", CareTaskListCreateView.as_view(), name="care-task-list"),
    path("care-tasks/<int:pk>/", CareTaskDetailView.as_view(), name="care-task-detail"),
]
