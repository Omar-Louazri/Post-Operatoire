from django.conf import settings
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import AlertAssessment, AlertRule
from core.serializers import (
    AlertAssessmentSerializer,
    AlertEvaluationSerializer,
    AlertRuleSerializer,
)

SEVERITY_RANK = {
    AlertRule.Severity.LOW: 1,
    AlertRule.Severity.MEDIUM: 2,
    AlertRule.Severity.HIGH: 3,
    AlertRule.Severity.CRITICAL: 4,
}


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"service": settings.SERVICE_NAME, "status": "ok"})


class AlertRuleListView(ListAPIView):
    queryset = AlertRule.objects.all()
    serializer_class = AlertRuleSerializer


class AlertAssessmentListView(ListAPIView):
    queryset = AlertAssessment.objects.all()
    serializer_class = AlertAssessmentSerializer


class AlertEvaluationView(APIView):
    def post(self, request):
        serializer = AlertEvaluationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        rules = AlertRule.objects.in_bulk(field_name="code")
        triggered_rules = []
        computed_severity = AlertRule.Severity.LOW

        def apply_rule(code: str):
            nonlocal computed_severity

            rule = rules.get(code)
            if not rule:
                return

            triggered_rules.append(
                {
                    "code": rule.code,
                    "title": rule.title,
                    "severity": rule.severity,
                    "immediate_action": rule.immediate_action,
                }
            )
            if SEVERITY_RANK[rule.severity] > SEVERITY_RANK[computed_severity]:
                computed_severity = rule.severity

        if payload["pain_level"] >= 7:
            apply_rule("PAIN-SEVERE")
        if payload["has_fever"]:
            apply_rule("FEVER-POSTOP")
        if payload["bleeding_level"] in {"moderate", "severe"}:
            apply_rule("BLEEDING-ACTIVE")
        if payload["swelling_level"] >= 2:
            apply_rule("SWELLING-PROGRESSIVE")

        if triggered_rules:
            unique_actions = list(
                dict.fromkeys(rule["immediate_action"] for rule in triggered_rules)
            )
            recommendation = " ".join(unique_actions)
        else:
            recommendation = (
                "Aucune escalade critique detectee. Poursuivre la surveillance "
                "standard et reevaluer dans le questionnaire suivant."
            )

        assessment = AlertAssessment.objects.create(
            patient_code=payload["patient_code"],
            pain_level=payload["pain_level"],
            has_fever=payload["has_fever"],
            bleeding_level=payload["bleeding_level"],
            swelling_level=payload["swelling_level"],
            notes=payload.get("notes", ""),
            computed_severity=computed_severity,
            triggered_rules=triggered_rules,
            care_recommendation=recommendation,
        )

        return Response(
            {
                "assessment_id": assessment.id,
                "computed_severity": computed_severity,
                "triggered_rules": triggered_rules,
                "care_recommendation": recommendation,
            },
            status=status.HTTP_201_CREATED,
        )

# Create your views here.
