from rest_framework.test import APITestCase

from core.models import CareTeamContact


class CareCoordinationApiTests(APITestCase):
    def setUp(self):
        CareTeamContact.objects.create(
            full_name="Dr. Leila Benali",
            role="Chirurgien",
            specialty="Orthopedie",
            email="leila.benali@example.com",
            phone="+212600000001",
            availability="Du lundi au vendredi",
            is_primary=True,
        )

    def test_list_contacts(self):
        response = self.client.get("/api/care-team/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["role"], "Chirurgien")

# Create your tests here.
