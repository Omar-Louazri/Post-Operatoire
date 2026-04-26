from rest_framework.test import APITestCase

from core.models import QuestionnaireTemplate


class QuestionnaireApiTests(APITestCase):
    def setUp(self):
        self.template = QuestionnaireTemplate.objects.create(
            slug="suivi-j3",
            title="Questionnaire J+3",
            audience="Patient",
            cadence="Quotidien",
            intro_text="Auto-evaluation apres chirurgie.",
            medically_validated_by="Comite clinique",
            questions=[
                {"label": "Douleur", "type": "scale", "required": True},
            ],
        )

    def test_create_submission(self):
        response = self.client.post(
            "/api/submissions/",
            {
                "patient_code": "PT-2048",
                "template_slug": self.template.slug,
                "status": "submitted",
                "answers": {"douleur": 4},
                "pain_score": 4,
                "free_text": "Marche possible avec aide.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["template"]["slug"], self.template.slug)

# Create your tests here.
