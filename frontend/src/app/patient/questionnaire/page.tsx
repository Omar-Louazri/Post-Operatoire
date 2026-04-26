import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuestionnaireForm } from "@/components/questionnaire-form";
import { questionnaireApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  submitted: "Soumis",
  pending: "En attente",
  escalated: "Escaladé",
};

const statusColor: Record<string, string> = {
  submitted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  escalated: "bg-rose-100 text-rose-800 border-rose-200",
};

export default async function PatientQuestionnairePage() {
  const [templates, submissions] = await Promise.all([
    questionnaireApi.templates(),
    questionnaireApi.submissions(),
  ]);

  const patientSubmissions = submissions
    .filter((s) => s.patient_code === "PT-2048")
    .slice(0, 5);

  return (
    <div>
      {/* Step header */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 2/4</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-violet-100 text-violet-800 border-violet-200">
            <Server className="size-3" />
            questionnaire-service
          </Badge>
          <span>·</span>
          <span>GET /api/questionnaires/ · POST /api/submissions/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Questionnaire quotidien
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Complétez votre questionnaire de suivi du jour. Vos réponses sont
          transmises à votre équipe médicale et archivées dans le dossier de
          suivi.
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1fr_380px] lg:px-10">
        {/* Form */}
        {templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            Le service questionnaire-service (port 8002) est hors ligne.
          </div>
        ) : (
          <QuestionnaireForm templates={templates} />
        )}

        {/* History */}
        <div className="space-y-4">
          <Card className="border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mes réponses récentes</CardTitle>
              <CardDescription>Historique pour PT-2048</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune soumission enregistrée.
                </p>
              ) : (
                patientSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`border text-xs ${statusColor[sub.status] ?? "bg-muted text-foreground"}`}
                      >
                        {statusLabel[sub.status] ?? sub.status}
                      </Badge>
                      {sub.pain_score !== null && (
                        <Badge variant="secondary" className="text-xs">
                          Douleur {sub.pain_score}/10
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-medium">
                      {sub.template.title}
                    </p>
                    {sub.free_text && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {sub.free_text}
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {new Date(sub.submitted_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Available questionnaires */}
          <Card className="border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Questionnaires disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((t) => (
                <div key={t.slug} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.intro_text}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">{t.audience}</Badge>
                    <Badge variant="outline" className="text-xs">{t.cadence}</Badge>
                    <Badge variant="outline" className="text-xs">{t.questions.length} questions</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-6 pb-8 lg:px-10">
        <a
          href="/patient/exercices"
          className="flex items-center justify-between rounded-2xl bg-indigo-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Exercices guidés</p>
            <p className="mt-0.5 text-sm opacity-80">Suivez votre programme de rééducation à domicile.</p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
