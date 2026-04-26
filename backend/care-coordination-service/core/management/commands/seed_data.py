from datetime import datetime

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import CareCoordinationTask, CareTeamContact

CONTACT_FIXTURES = [
    {
        "email": "leila.benali@example.com",
        "full_name": "Dr. Leila Benali",
        "role": "Chirurgien",
        "specialty": "Orthopedie",
        "phone": "+212600000001",
        "availability": "Lun-Ven 09:00-18:00",
        "is_primary": True,
    },
    {
        "email": "samir.haddad@example.com",
        "full_name": "Samir Haddad",
        "role": "Kinesitherapeute",
        "specialty": "Reeducation locomotrice",
        "phone": "+212600000002",
        "availability": "Lun-Sam 08:00-17:00",
        "is_primary": False,
    },
    {
        "email": "nora.elidrissi@example.com",
        "full_name": "Nora El Idrissi",
        "role": "Coordinateur",
        "specialty": "Suivi de parcours",
        "phone": "+212600000003",
        "availability": "Lun-Ven 08:30-17:30",
        "is_primary": False,
    },
]

TASK_FIXTURES = [
    {
        "patient_code": "PT-2048",
        "title": "Appel infirmier J+2",
        "responsible_role": "Infirmier de suivi",
        "status": CareCoordinationTask.Status.PLANNED,
        "priority": CareCoordinationTask.Priority.HIGH,
        "due_at": timezone.make_aware(datetime(2026, 4, 26, 10, 0)),
        "summary": "Verifier pansement, douleur et tolerance au lever.",
        "channel": "Telephone",
    },
    {
        "patient_code": "PT-2048",
        "title": "Bilan kine de fin de semaine",
        "responsible_role": "Kinesitherapeute",
        "status": CareCoordinationTask.Status.IN_PROGRESS,
        "priority": CareCoordinationTask.Priority.MEDIUM,
        "due_at": timezone.make_aware(datetime(2026, 4, 29, 15, 30)),
        "summary": "Mesurer amplitude, endurance et adherence aux exercices.",
        "channel": "Visite cabinet",
    },
]


class Command(BaseCommand):
    help = "Seed coordination contacts and tasks."

    def handle(self, *args, **options):
        for fixture in CONTACT_FIXTURES:
            CareTeamContact.objects.update_or_create(
                email=fixture["email"],
                defaults=fixture,
            )

        for fixture in TASK_FIXTURES:
            CareCoordinationTask.objects.update_or_create(
                patient_code=fixture["patient_code"],
                title=fixture["title"],
                defaults=fixture,
            )

        self.stdout.write(self.style.SUCCESS("Care coordination data seeded."))
