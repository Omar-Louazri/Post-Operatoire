import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionnaireForm } from "@/components/questionnaire-form";
import { questionnaireApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  submitted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  escalated: "bg-rose-100 text-rose-800 border-rose-200",
};

const statusLabel: Record<string, string> = {
  submitted: "Soumis",
  pending: "En attente",
  escalated: "Escaladé",
};

export default async function KinePatientsPage() {
  const [submissions, templates] = await Promise.all([
    questionnaireApi.submissions(),
    questionnaireApi.templates(),
  ]);

  const kineTemplates = templates.filter(
    (t) => t.audience.toLowerCase().includes("kine") || t.audience.toLowerCase().includes("kiné"),
  );

  const kineSubmissions = submissions.filter((s) =>
    kineTemplates.some((t) => t.slug === s.template.slug),
  );

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 2/2</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-violet-100 text-violet-800 border-violet-200">
            <Server className="size-3" />
            questionnaire-service :8002
          </Badge>
          <span>·</span>
          <span>GET /api/submissions/ · POST /api/submissions/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Suivi patients
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Consultez les réponses aux questionnaires de mobilité et d&apos;autonomie,
          et enregistrez une nouvelle évaluation terrain.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-5">
          {/* Kine-specific questionnaires */}
          <Card className="border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Questionnaires kinésithérapie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kineTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun questionnaire spécifique kinésithérapie trouvé.
                </p>
              ) : (
                kineTemplates.map((t) => (
                  <div key={t.slug} className="rounded-xl border border-border/60 bg-indigo-50/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{t.title}</p>
                      <Badge variant="outline" className="text-xs">{t.cadence}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.intro_text}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.questions.map((q) => (
                        <span
                          key={q.label}
                          className="rounded-md border border-border/40 bg-white px-2 py-0.5 text-xs text-foreground/70"
                        >
                          {q.label}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Validé par : {t.medically_validated_by}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Submissions */}
          <Card className="border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Réponses enregistrées</CardTitle>
                <Badge variant="secondary">{kineSubmissions.length} réponses kiné</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {kineSubmissions.length === 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Aucune réponse kinésithérapie enregistrée.
                  </p>
                  {submissions.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Toutes les soumissions ({submissions.length}) :
                      </p>
                      {submissions.map((sub) => (
                        <SubmissionCard key={sub.id} sub={sub} statusColor={statusColor} statusLabel={statusLabel} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                kineSubmissions.map((sub) => (
                  <SubmissionCard key={sub.id} sub={sub} statusColor={statusColor} statusLabel={statusLabel} />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form for recording new assessment */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Enregistrer une évaluation
          </p>
          <QuestionnaireForm templates={templates} />
          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border/60 p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </div>
  );
}

function SubmissionCard({
  sub,
  statusColor,
  statusLabel,
}: {
  sub: { id: number; patient_code: string; template: { title: string }; status: string; pain_score: number | null; free_text: string; submitted_at: string };
  statusColor: Record<string, string>;
  statusLabel: Record<string, string>;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-xs font-medium">{sub.patient_code}</span>
        <Badge
          variant="outline"
          className={`border text-[10px] ${statusColor[sub.status] ?? "bg-muted text-foreground"}`}
        >
          {statusLabel[sub.status] ?? sub.status}
        </Badge>
        {sub.pain_score !== null && (
          <Badge variant="secondary" className="text-[10px]">
            Douleur {sub.pain_score}/10
          </Badge>
        )}
      </div>
      <p className="mt-1 text-sm font-medium">{sub.template.title}</p>
      {sub.free_text && (
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{sub.free_text}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {new Date(sub.submitted_at).toLocaleString("fr-FR")}
      </p>
    </div>
  );
}
