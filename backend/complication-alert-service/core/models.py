from django.db import models


class AlertRule(models.Model):
    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    code = models.CharField(max_length=80, unique=True)
    title = models.CharField(max_length=200)
    severity = models.CharField(max_length=20, choices=Severity.choices)
    trigger_conditions = models.JSONField(default=list)
    immediate_action = models.TextField()

    class Meta:
        ordering = ["code"]

    def __str__(self) -> str:
        return self.code


class AlertAssessment(models.Model):
    patient_code = models.CharField(max_length=50)
    pain_level = models.PositiveSmallIntegerField()
    has_fever = models.BooleanField(default=False)
    bleeding_level = models.CharField(max_length=20)
    swelling_level = models.PositiveSmallIntegerField(default=0)
    notes = models.TextField(blank=True)
    computed_severity = models.CharField(max_length=20, choices=AlertRule.Severity.choices)
    triggered_rules = models.JSONField(default=list)
    care_recommendation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.patient_code} - {self.computed_severity}"

# Create your models here.
