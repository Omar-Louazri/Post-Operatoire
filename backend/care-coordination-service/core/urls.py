from django.urls import path

from core.views import CareTaskListView, CareTeamListView, HealthView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("care-team/", CareTeamListView.as_view(), name="care-team-list"),
    path("care-tasks/", CareTaskListView.as_view(), name="care-task-list"),
]
