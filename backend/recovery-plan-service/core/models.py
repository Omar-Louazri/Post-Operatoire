from django.db import models


class RecoveryPlanTemplate(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    specialty = models.CharField(max_length=120)
    surgery_type = models.CharField(max_length=120)
    target_duration_days = models.PositiveIntegerField()
    overview = models.TextField()
    weekly_objectives = models.JSONField(default=list)
    self_check_prompts = models.JSONField(default=list)
    care_team_roles = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["specialty", "title"]

    def __str__(self) -> str:
        return self.title

# Create your models here.
