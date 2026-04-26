from datetime import date

from django.db import models


class QuestionnaireTemplate(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    audience = models.CharField(max_length=120)
    cadence = models.CharField(max_length=80)
    intro_text = models.TextField()
    medically_validated_by = models.CharField(max_length=160)
    questions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class QuestionnaireSubmission(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUBMITTED = "submitted", "Submitted"
        ESCALATED = "escalated", "Escalated"

    patient_code = models.CharField(max_length=50)
    template = models.ForeignKey(
        QuestionnaireTemplate,
        related_name="submissions",
        on_delete=models.CASCADE,
    )
    scheduled_for = models.DateField(default=date.today)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED,
    )
    answers = models.JSONField(default=dict)
    pain_score = models.PositiveSmallIntegerField(default=0)
    free_text = models.TextField(blank=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self) -> str:
        return f"{self.patient_code} - {self.template.title}"

# Create your models here.
