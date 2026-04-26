from rest_framework.test import APITestCase

from core.models import RecoveryPlanTemplate


class RecoveryPlanApiTests(APITestCase):
    def setUp(self):
        self.plan = RecoveryPlanTemplate.objects.create(
            slug="orthopedie-prothese-genou",
            title="Parcours genou prothese",
            specialty="Orthopedie",
            surgery_type="Prothese du genou",
            target_duration_days=45,
            overview="Plan de recuperation standardise sur 6 semaines.",
            weekly_objectives=["Marcher 10 minutes"],
            self_check_prompts=["Verifier la douleur quotidienne"],
            care_team_roles=["Chirurgien", "Kine"],
        )

    def test_list_recovery_plans(self):
        response = self.client.get("/api/recovery-plans/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["slug"], self.plan.slug)

# Create your tests here.
