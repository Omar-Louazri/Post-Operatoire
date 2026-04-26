from django.core.management.base import BaseCommand

from core.models import AlertRule

RULE_FIXTURES = [
    {
        "code": "PAIN-SEVERE",
        "title": "Douleur post-operatoire severe",
        "severity": AlertRule.Severity.HIGH,
        "trigger_conditions": ["Douleur >= 7/10", "Recrudescence nocturne"],
        "immediate_action": "Contacter le chirurgien ou le medecin reeducateur dans la journee.",
    },
    {
        "code": "FEVER-POSTOP",
        "title": "Fievre ou syndrome infectieux",
        "severity": AlertRule.Severity.CRITICAL,
        "trigger_conditions": ["Fievre declaree", "Frissons ou malaise"],
        "immediate_action": "Evaluer rapidement le patient et verifier la cicatrice chirurgicale.",
    },
    {
        "code": "BLEEDING-ACTIVE",
        "title": "Saignement actif",
        "severity": AlertRule.Severity.CRITICAL,
        "trigger_conditions": ["Saignement modere ou severe", "Pansement traverse"],
        "immediate_action": "Activer une evaluation urgente infirmiere ou chirurgicale.",
    },
    {
        "code": "SWELLING-PROGRESSIVE",
        "title": "Oedeme progressif",
        "severity": AlertRule.Severity.MEDIUM,
        "trigger_conditions": ["Oedeme >= niveau 2", "Gene fonctionnelle associee"],
        "immediate_action": "Revoir l'elevation du membre, la glace et la tolerance a l'appui.",
    },
]


class Command(BaseCommand):
    help = "Seed alert rules."

    def handle(self, *args, **options):
        for fixture in RULE_FIXTURES:
            AlertRule.objects.update_or_create(
                code=fixture["code"],
                defaults=fixture,
            )

        self.stdout.write(self.style.SUCCESS("Complication alert rules seeded."))
