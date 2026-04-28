import { AlertTriangle, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AssessmentManager } from "@/components/assessment-manager";
import { alertApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const PATIENT_CODE = "PT-2048";

const severityColor: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800 border-rose-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const severityLabel: Record<string, string> = {
  critical: "CRITIQUE",
  high: "ÉLEVÉ",
  medium: "MODÉRÉ",
  low: "FAIBLE",
};

export default async function PatientAlertesPage() {
  const [rules, assessments] = await Promise.all([
    alertApi.rules(),
    alertApi.assessments(PATIENT_CODE),
  ]);

  return (
    <div>
      {/* En-tête */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
          Surveillance des complications
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Mes évaluations de symptômes
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Créez, consultez, modifiez ou supprimez vos évaluations. Chaque
          soumission est analysée automatiquement selon les règles cliniques.
        </p>
      </div>

      <div className="px-6 py-8 lg:px-10">
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="size-4 text-amber-700" />
          <AlertTitle className="text-amber-900">Avertissement</AlertTitle>
          <AlertDescription className="text-amber-800">
            Cet outil est une aide à la décision, pas un diagnostic médical.
            En cas d&apos;urgence, appelez le 15 (SAMU) ou le 112.
          </AlertDescription>
        </Alert>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar : règles */}
          <aside className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Signaux surveillés
              </p>
              <p className="text-sm text-muted-foreground">
                Le système évalue vos symptômes selon{" "}
                <strong>{rules.length} règles</strong> cliniques.
              </p>
            </div>

            {rules.map((rule) => (
              <div
                key={rule.code}
                className="rounded-xl border border-border/60 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{rule.title}</p>
                  <Badge
                    variant="outline"
                    className={`shrink-0 border text-[10px] ${severityColor[rule.severity] ?? ""}`}
                  >
                    {severityLabel[rule.severity] ?? rule.severity}
                  </Badge>
                </div>
                <ul className="mt-2 space-y-1">
                  {rule.trigger_conditions.map((cond) => (
                    <li
                      key={cond}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground" />
                      {cond}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs text-foreground/80">
                  → {rule.immediate_action}
                </div>
              </div>
            ))}

            {rules.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune règle disponible pour le moment.
              </p>
            )}

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-700" />
                <p className="text-sm font-medium text-emerald-900">
                  Aucun symptôme ?
                </p>
              </div>
              <p className="mt-1 text-xs text-emerald-800">
                Vous avez terminé votre parcours du jour. Bravo !
              </p>
              <a
                href="/"
                className="mt-3 block rounded-lg bg-emerald-600 px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </aside>

          {/* Main CRUD */}
          <main>
            <AssessmentManager
              patientCode={PATIENT_CODE}
              initial={assessments}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
