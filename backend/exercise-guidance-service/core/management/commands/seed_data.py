from django.core.management.base import BaseCommand

from core.models import ExerciseProtocol

EXERCISE_FIXTURES = [
    {
        "slug": "pompes-cheville-lit",
        "title": "Pompes de cheville au lit",
        "phase": "Immediate post-op",
        "difficulty": "Debutant",
        "duration_minutes": 8,
        "summary": "Active le retour veineux et entretient la mobilite precoce.",
        "equipment": ["Oreiller de sur-elevation"],
        "instructions": [
            "Allonge, alterner flexion et extension de cheville pendant 2 minutes",
            "Faire 3 series avec pause de 30 secondes",
        ],
        "validation_criteria": [
            "Aucune douleur vive ou sensation d'etau",
            "Respect des consignes de respiration",
        ],
        "media_url": "https://example.com/videos/pompes-cheville",
    },
    {
        "slug": "marche-corridor-fractionnee",
        "title": "Marche fractionnee en corridor",
        "phase": "Semaine 2",
        "difficulty": "Intermediaire",
        "duration_minutes": 15,
        "summary": "Reprise d'endurance controlee avec surveillance de la fatigue.",
        "equipment": ["Deambulateur ou canne"],
        "instructions": [
            "Marcher 3 blocs de 5 minutes",
            "Faire un auto-check douleur et essoufflement a chaque bloc",
        ],
        "validation_criteria": [
            "Fatigue recuperable en moins de 10 minutes",
            "Stabilite de l'appui sans compensation majeure",
        ],
        "media_url": "https://example.com/videos/marche-corridor",
    },
    {
        "slug": "respiration-thoracique-guidee",
        "title": "Respiration thoracique guidee",
        "phase": "Cardiaque",
        "difficulty": "Debutant",
        "duration_minutes": 10,
        "summary": "Travail respiratoire pour patients sternotomises.",
        "equipment": ["Spirometre incitatif"],
        "instructions": [
            "Inspirer lentement en gardant les epaules relachees",
            "Maintenir 2 secondes puis expirer progressivement",
        ],
        "validation_criteria": [
            "Absence de douleur sternale inhabituelle",
            "Bonne synchronisation inspiration-expiration",
        ],
        "media_url": "https://example.com/videos/respiration-thoracique",
    },
]


class Command(BaseCommand):
    help = "Seed exercise guidance templates."

    def handle(self, *args, **options):
        for fixture in EXERCISE_FIXTURES:
            ExerciseProtocol.objects.update_or_create(
                slug=fixture["slug"],
                defaults=fixture,
            )

        self.stdout.write(self.style.SUCCESS("Exercise guidance data seeded."))
