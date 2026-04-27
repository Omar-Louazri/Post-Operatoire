from django.db import models


class CareTeamContact(models.Model):
    full_name = models.CharField(max_length=160)
    role = models.CharField(max_length=120)
    specialty = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50)
    availability = models.CharField(max_length=160)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_primary", "role", "full_name"]

    def __str__(self) -> str:
        return self.full_name


class PatientCareAssignment(models.Model):
    patient_code = models.CharField(max_length=50, db_index=True)
    contact = models.ForeignKey(
        CareTeamContact,
        on_delete=models.CASCADE,
        related_name="assignments",
    )
    role_on_case = models.CharField(max_length=120)
    notes = models.TextField(blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["role_on_case"]
        unique_together = [("patient_code", "contact")]

    def __str__(self) -> str:
        return f"{self.patient_code} — {self.contact.full_name} ({self.role_on_case})"


class CareCoordinationTask(models.Model):
    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        IN_PROGRESS = "in_progress", "In progress"
        DONE = "done", "Done"

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    patient_code = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=200)
    responsible_role = models.CharField(max_length=120)
    status = models.CharField(max_length=20, choices=Status.choices)
    priority = models.CharField(max_length=20, choices=Priority.choices)
    due_at = models.DateTimeField()
    summary = models.TextField()
    channel = models.CharField(max_length=80)

    class Meta:
        ordering = ["due_at"]

    def __str__(self) -> str:
        return f"{self.patient_code} - {self.title}"
