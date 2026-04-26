import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default async function ChirurgienQuestionnairesPage() {
  const [submissions, templates] = await Promise.all([
    questionnaireApi.submissions(),
    questionnaireApi.templates(),
  ]);

  const avgPain =
    submissions.filter((s) => s.pain_score !== null).length > 0
      ? (
          submissions
            .filter((s) => s.pain_score !== null)
            .reduce((acc, s) => acc + (s.pain_score ?? 0), 0) /
          submissions.filter((s) => s.pain_score !== null).length
        ).toFixed(1)
      : "—";

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 2/3</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-violet-100 text-violet-800 border-violet-200">
            <Server className="size-3" />
            questionnaire-service :8002
          </Badge>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Réponses patients
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Synthèse de toutes les soumissions enregistrées. Identifiez rapidement
          les patients avec des scores élevés ou des statuts escaladés.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8 lg:px-10">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Soumissions", value: submissions.length },
            {
              label: "Questionnaires",
              value: templates.length,
            },
            {
              label: "Escaladés",
              value: submissions.filter((s) => s.status === "escalated").length,
            },
            { label: "Score douleur moy.", value: avgPain },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-white shadow-sm">
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submissions table */}
        <Card className="border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Toutes les réponses</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune soumission. Service questionnaire-service (port 8002) peut être hors ligne.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Questionnaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Score douleur</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {sub.patient_code}
                      </TableCell>
                      <TableCell className="text-sm">{sub.template.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border text-xs ${statusColor[sub.status] ?? "bg-muted text-foreground"}`}
                        >
                          {statusLabel[sub.status] ?? sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.pain_score !== null ? (
                          <span
                            className={`font-semibold ${sub.pain_score >= 7 ? "text-rose-600" : sub.pain_score >= 4 ? "text-amber-600" : "text-emerald-600"}`}
                          >
                            {sub.pain_score}/10
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-40 truncate text-xs text-muted-foreground">
                        {sub.free_text || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(sub.submitted_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <a
          href="/chirurgien/alertes"
          className="flex items-center justify-between rounded-2xl bg-rose-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Règles d&apos;alerte</p>
            <p className="mt-0.5 text-sm opacity-80">
              Gérez les seuils de détection des complications post-opératoires.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
