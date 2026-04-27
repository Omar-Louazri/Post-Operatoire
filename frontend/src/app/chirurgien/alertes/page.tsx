import { Server, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomChecker } from "@/components/symptom-checker";
import { alertApi, recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const severityColor: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800 border-rose-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

export default async function ChirurgienAlertesPage() {
  const [rules, plans] = await Promise.all([alertApi.rules(), recoveryApi.plans()]);

  const allPatientCodes = [...new Set(plans.map((p) => p.patient_code))].sort();
  const sorted = [...rules].sort(
    (a, b) =>
      (severityOrder[b.severity] ?? 0) - (severityOrder[a.severity] ?? 0),
  );

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 3/3</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-rose-100 text-rose-800 border-rose-200">
            <Server className="size-3" />
            complication-alert-service :8004
          </Badge>
          <span>·</span>
          <span>GET /api/alert-rules/ · POST /api/alerts/evaluate/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Règles d&apos;alerte & triage
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Visualisez les règles de détection configurées et simulez un triage
          clinique pour évaluer un profil symptomatique patient.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 lg:grid-cols-[340px_1fr] lg:px-10">
        {/* Rules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-rose-600" />
            <p className="text-sm font-semibold">
              {rules.length} règles configurées
            </p>
          </div>
          {sorted.map((rule) => (
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
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Déclenchement si
                  </p>
                  <ul className="space-y-1">
                    {rule.trigger_conditions.map((c) => (
                      <li key={c} className="flex items-start gap-1.5 text-xs text-foreground/80">
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-rose-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs font-medium text-foreground/80">
                  {rule.immediate_action}
                </div>
              </CardContent>
            </Card>
          ))}

          {rules.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Service complication-alert-service (port 8004) hors ligne.
            </p>
          )}

          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border/60 p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Retour à l&apos;accueil
          </a>
        </div>

        {/* Triage tool */}
        <SymptomChecker availablePatientCodes={allPatientCodes} />
      </div>
    </div>
  );
}
