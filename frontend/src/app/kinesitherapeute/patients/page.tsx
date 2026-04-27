import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NouveauTemplateForm } from "@/components/nouveau-template-form";
import { QuestionnaireForm } from "@/components/questionnaire-form";
import { SubmissionCard } from "@/components/submission-card";
import { TemplateCard } from "@/components/template-card";
import { questionnaireApi, recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function KinePatientsPage() {
  const [submissions, templates, plans] = await Promise.all([
    questionnaireApi.submissions(),
    questionnaireApi.templates(),
    recoveryApi.plans(),
  ]);

  const allPatientCodes = [
    ...new Set([
      ...plans.map((p) => p.patient_code),
      ...submissions.map((s) => s.patient_code),
    ]),
  ].sort();

  const kineTemplates = templates.filter(
    (t) => t.audience.toLowerCase().includes("kine") || t.audience.toLowerCase().includes("kiné"),
  );

  const kineSubmissions = submissions.filter((s) =>
    kineTemplates.some((t) => t.slug === s.template.slug),
  );

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Kinésithérapie
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Suivi patients</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Consultez les réponses aux questionnaires de mobilité et d&apos;autonomie,
          et enregistrez une nouvelle évaluation terrain.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-5">
          {/* Kine-specific questionnaires */}
          <NouveauTemplateForm />
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
                kineTemplates.map((t) => <TemplateCard key={t.slug} template={t} />)
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
                <p className="text-sm text-muted-foreground">
                  Aucune réponse kinésithérapie enregistrée.
                </p>
              ) : (
                kineSubmissions.map((sub) => (
                  <SubmissionCard key={sub.id} submission={sub} />
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
          <QuestionnaireForm templates={templates} availablePatientCodes={allPatientCodes} />
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

