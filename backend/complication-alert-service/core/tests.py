from rest_framework.test import APITestCase

from core.models import AlertRule


class AlertEvaluationTests(APITestCase):
    def setUp(self):
        AlertRule.objects.create(
            code="PAIN-SEVERE",
            title="Douleur post-op elevee",
            severity="high",
            trigger_conditions=["Douleur >= 7/10"],
            immediate_action="Contacter le chirurgien dans la journee.",
        )

    def test_evaluate_alert(self):
        response = self.client.post(
            "/api/alerts/evaluate/",
            {
                "patient_code": "PT-2048",
                "pain_level": 8,
                "has_fever": False,
                "bleeding_level": "none",
                "swelling_level": 1,
                "notes": "Pic de douleur la nuit.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["computed_severity"], "high")

# Create your tests here.
