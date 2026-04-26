from datetime import date

from django.core.management.base import BaseCommand

from core.models import QuestionnaireSubmission, QuestionnaireTemplate

QUESTIONNAIRE_FIXTURES = [
    {
        "slug": "quotidien-douleur-fatigue",
        "title": "Suivi quotidien douleur et fatigue",
        "audience": "Patient",
        "cadence": "Quotidien",
        "intro_text": "Controle express des symptomes et de la recuperation fonctionnelle.",
        "medically_validated_by": "Comite douleur et reeducation",
        "questions": [
            {"label": "Niveau de douleur", "type": "scale", "required": True},
            {"label": "Temperature anormale", "type": "boolean", "required": True},
            {"label": "Saignement ou ecoulement", "type": "boolean", "required": True},
        ],
    },
    {
        "slug": "hebdo-autonomie-mobilite",
        "title": "Suivi hebdomadaire autonomie et mobilite",
        "audience": "Kinesitherapeute",
        "cadence": "Hebdomadaire",
        "intro_text": "Evaluation consolidee de la reprise d'activite et de la tolerance aux exercices.",
        "medically_validated_by": "College de medecine reeducatrice",
        "questions": [
            {"label": "Marche sans assistance", "type": "boolean", "required": True},
            {"label": "Amplitude articulaire", "type": "text", "required": False},
            {"label": "Observations terrain", "type": "textarea", "required": False},
        ],
    },
]

SAMPLE_SUBMISSION = {
    "patient_code": "PT-2048",
    "scheduled_for": date(2026, 4, 25),
    "status": QuestionnaireSubmission.Status.SUBMITTED,
    "answers": {
        "douleur": 4,
        "temperature": False,
        "saignement": False,
    },
    "pain_score": 4,
    "free_text": "Douleur supportable apres la seance de marche.",
}


class Command(BaseCommand):
    help = "Seed questionnaire templates and sample submissions."

    def handle(self, *args, **options):
        templates = {}
        for fixture in QUESTIONNAIRE_FIXTURES:
            template, _ = QuestionnaireTemplate.objects.update_or_create(
                slug=fixture["slug"],
                defaults=fixture,
            )
            templates[template.slug] = template

        QuestionnaireSubmission.objects.update_or_create(
            patient_code=SAMPLE_SUBMISSION["patient_code"],
            template=templates["quotidien-douleur-fatigue"],
            scheduled_for=SAMPLE_SUBMISSION["scheduled_for"],
            defaults=SAMPLE_SUBMISSION,
        )

        self.stdout.write(self.style.SUCCESS("Questionnaire data seeded."))
