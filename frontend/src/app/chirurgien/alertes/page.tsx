import { ClipboardList, Server, ShieldAlert, Siren, UserSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientSelectorClient } from "@/components/patient-selector";
import { SymptomChecker } from "@/components/symptom-checker";
import { alertApi, questionnaireApi, recoveryApi } from "@/lib/api";
import type { AlertAssessment, QuestionnaireSubmission } from "@/lib/api";

export const dynamic = "force-dynamic";

const severityColor: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800 border-rose-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const statusColor: Record<string, string> = {
  submitted: "bg-sky-100 text-sky-800 border-sky-200",
  escalated: "bg-rose-100 text-rose-800 border-rose-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
};

const statusLabel: Record<string, string> = {
  submitted: "Soumis",
  escalated: "Escaladé",
  pending: "En attente",
};

function SubmissionCard({ sub }: { sub: QuestionnaireSubmission }) {
  const answersEntries = Object.entries(sub.answers);

  return (
    <Card className="border-border/60 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-sm font-semibold">
              {sub.template.title}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(sub.submitted_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sub.pain_score !== null && (
              <Badge
                variant="outline"
                className={`text-[10px] border ${sub.pain_score >= 7 ? "bg-rose-100 text-rose-800 border-rose-200" : sub.pain_score >= 4 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}
              >
                Douleur {sub.pain_score}/10
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-[10px] border ${statusColor[sub.status] ?? ""}`}
            >
              {statusLabel[sub.status] ?? sub.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {answersEntries.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Réponses
            </p>
            <dl className="grid gap-1">
              {answersEntries.map(([key, value]) => (
                <div key={key} className="flex gap-2 text-xs">
                  <dt className="shrink-0 font-medium text-foreground/70">{key} :</dt>
                  <dd className="text-foreground/90">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {sub.free_text && (
          <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-foreground/80 italic">
            &ldquo;{sub.free_text}&rdquo;
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssessmentCard({ assessment }: { assessment: AlertAssessment }) {
  return (
    <Card className="border-border/60 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Siren className="size-4 text-rose-500" />
              Évaluation #{assessment.id}
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(assessment.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] border ${severityColor[assessment.computed_severity] ?? ""}`}
          >
            {assessment.computed_severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Douleur</p>
            <p className="font-semibold">{assessment.pain_level}/10</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Fièvre</p>
            <p className="font-semibold">{assessment.has_fever ? "Oui" : "Non"}</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Saignement</p>
            <p className="font-semibold capitalize">{assessment.bleeding_level}</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Œdème</p>
            <p className="font-semibold">{assessment.swelling_level}/3</p>
          </div>
        </div>
        <div className="rounded-lg bg-sky-50/60 border border-sky-100 px-3 py-2 text-xs text-foreground/80">
          {assessment.care_recommendation}
        </div>
        {assessment.triggered_rules.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Règles déclenchées
            </p>
            {assessment.triggered_rules.map((rule) => (
              <div
                key={rule.code}
                className="flex items-start gap-2 rounded-lg border border-border/60 bg-card px-3 py-2"
              >
                <Badge variant="outline" className="shrink-0 text-[9px] mt-0.5">
                  {rule.code}
                </Badge>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{rule.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{rule.immediate_action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function ChirurgienAlertesPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>;
}) {
  const { patient: selectedPatient = "" } = await searchParams;

  const [rules, plans, submissions, assessments] = await Promise.all([
    alertApi.rules(),
    recoveryApi.plans(),
    selectedPatient ? questionnaireApi.submissions(selectedPatient) : Promise.resolve([]),
    selectedPatient ? alertApi.assessments(selectedPatient) : Promise.resolve([]),
  ]);

  const allPatientCodes = [...new Set(plans.map((p) => p.patient_code))].sort();

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1 bg-rose-100 text-rose-800 border-rose-200">
            <Server className="size-3" />
            complication-alert-service :8004
          </Badge>
          <span>·</span>
          <span>GET /api/alert-rules/ · GET /api/alerts/ · GET /api/submissions/</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold">
              Alertes & Questionnaires
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Sélectionnez un patient pour consulter ses réponses aux questionnaires
              et les alertes cliniques associées.
            </p>
          </div>
          <PatientSelectorClient
            patientCodes={allPatientCodes}
            selectedPatient={selectedPatient}
          />
        </div>
      </div>

      {selectedPatient ? (
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-2 lg:px-10">
          {/* Questionnaire submissions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-sky-600" />
              <p className="text-sm font-semibold">
                Questionnaires — {selectedPatient}
              </p>
              <Badge variant="secondary" className="text-xs">
                {submissions.length}
              </Badge>
            </div>

            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                <ClipboardList className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Aucun questionnaire soumis pour ce patient.
                </p>
              </div>
            )}
          </div>

          {/* Alert assessments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-600" />
              <p className="text-sm font-semibold">
                Évaluations d&apos;alerte — {selectedPatient}
              </p>
              <Badge variant="secondary" className="text-xs">
                {assessments.length}
              </Badge>
            </div>

            {assessments.length > 0 ? (
              assessments.map((a) => (
                <AssessmentCard key={a.id} assessment={a} />
              ))
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
                  <ShieldAlert className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Aucune évaluation d&apos;alerte enregistrée.
                    Lancez un triage manuel ci-dessous.
                  </p>
                </div>
                <SymptomChecker availablePatientCodes={[selectedPatient]} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[340px_1fr] lg:px-10">
          {/* Rules sidebar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-600" />
              <p className="text-sm font-semibold">
                {rules.length} règles configurées
              </p>
            </div>
            {rules
              .slice()
              .sort(
                (a, b) =>
                  ({ critical: 4, high: 3, medium: 2, low: 1 }[b.severity] ?? 0) -
                  ({ critical: 4, high: 3, medium: 2, low: 1 }[a.severity] ?? 0),
              )
              .map((rule) => (
                <Card key={rule.code} className="border-border/60 bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold leading-tight">
                        {rule.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`shrink-0 border text-[10px] ${severityColor[rule.severity] ?? ""}`}
                      >
                        {rule.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <code className="text-xs text-muted-foreground">{rule.code}</code>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1">
                      {rule.trigger_conditions.map((c) => (
                        <li key={c} className="flex items-start gap-1.5 text-xs text-foreground/80">
                          <span className="mt-1 size-1 shrink-0 rounded-full bg-rose-400" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs font-medium text-foreground/80">
                      {rule.immediate_action}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-12 text-center">
            <UserSearch className="size-12 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-semibold text-foreground/60">
              Sélectionnez un patient
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Choisissez un patient dans le menu déroulant en haut de page pour
              afficher ses questionnaires et les alertes cliniques associées.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
