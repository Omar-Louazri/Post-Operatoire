from django.db import models


class ExerciseProtocol(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    phase = models.CharField(max_length=120)
    difficulty = models.CharField(max_length=80)
    duration_minutes = models.PositiveIntegerField()
    summary = models.TextField()
    equipment = models.JSONField(default=list)
    instructions = models.JSONField(default=list)
    validation_criteria = models.JSONField(default=list)
    media_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["phase", "title"]

    def __str__(self) -> str:
        return self.title

# Create your models here.
