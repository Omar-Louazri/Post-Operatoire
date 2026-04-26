from rest_framework.test import APITestCase

from core.models import ExerciseProtocol


class ExerciseApiTests(APITestCase):
    def setUp(self):
        ExerciseProtocol.objects.create(
            slug="mobilite-cheville",
            title="Mobilite cheville",
            phase="Semaine 1",
            difficulty="Debutant",
            duration_minutes=12,
            summary="Mobilisation douce en flexion et extension.",
            equipment=["Serviette"],
            instructions=["Assis, mouvement lent sur 10 repetitions."],
            validation_criteria=["Douleur inferieure ou egale a 3/10"],
            media_url="https://example.com/video/mobilite-cheville",
        )

    def test_list_exercises(self):
        response = self.client.get("/api/exercises/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["slug"], "mobilite-cheville")

# Create your tests here.
