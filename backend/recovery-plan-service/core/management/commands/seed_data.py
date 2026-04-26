from django.core.management.base import BaseCommand

from core.models import RecoveryPlanTemplate

PLAN_FIXTURES = [
    {
        "slug": "orthopedie-prothese-genou",
        "title": "Parcours post-op prothese du genou",
        "specialty": "Orthopedie",
        "surgery_type": "Prothese totale du genou",
        "target_duration_days": 45,
        "overview": (
            "Parcours centre sur la reprise d'appui progressive, le controle "
            "de la douleur et la recuperation de l'amplitude articulaire."
        ),
        "weekly_objectives": [
            "Semaine 1: controle douleur et autonomie au lever",
            "Semaine 2: flexion genou > 90 degres avec aide",
            "Semaine 4: marche quotidienne 20 minutes",
        ],
        "self_check_prompts": [
            "Observer douleur, rougeur et oedeme autour de la cicatrice",
            "Verifier l'appui et la tolerance a la marche",
            "Signaler toute fievre ou saignement inhabituel",
        ],
        "care_team_roles": [
            "Chirurgien orthopediste",
            "Kinesitherapeute",
            "Infirmier de suivi",
        ],
    },
    {
        "slug": "cardiaque-pontage",
        "title": "Parcours reeducation apres pontage",
        "specialty": "Cardiaque",
        "surgery_type": "Pontage coronarien",
        "target_duration_days": 60,
        "overview": (
            "Plan progressif avec auto-surveillance respiratoire, marche "
            "encadree et coordination cardiologie-kinesitherapie."
        ),
        "weekly_objectives": [
            "Semaine 1: exercices respiratoires quotidiens",
            "Semaine 3: marche fractionnee 15 minutes matin et soir",
            "Semaine 6: reprise d'activites domestiques legeres",
        ],
        "self_check_prompts": [
            "Suivre poids, essoufflement et fatigue",
            "Verifier la cicatrice sternale et l'absence de fievre",
            "Noter toute douleur thoracique ou palpitations",
        ],
        "care_team_roles": [
            "Chirurgien cardiaque",
            "Medecin reeducateur",
            "Coordinateur de parcours",
        ],
    },
]


class Command(BaseCommand):
    help = "Seed recovery plan templates."

    def handle(self, *args, **options):
        for fixture in PLAN_FIXTURES:
            RecoveryPlanTemplate.objects.update_or_create(
                slug=fixture["slug"],
                defaults=fixture,
            )

        self.stdout.write(self.style.SUCCESS("Recovery plan templates seeded."))
