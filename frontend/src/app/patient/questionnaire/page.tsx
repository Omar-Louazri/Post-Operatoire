import { QuestionnaireSection } from "@/components/questionnaire-section";
import { questionnaireApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const PATIENT_CODE = "PT-2048";

export default async function PatientQuestionnairePage() {
  const [templates, submissions] = await Promise.all([
    questionnaireApi.templates(),
    questionnaireApi.submissions(),
  ]);

  const patientSubmissions = submissions
    .filter((s) => s.patient_code === PATIENT_CODE)
    .slice(0, 5);

  return (
    <div>
      {/* En-tête */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
          Suivi quotidien
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Questionnaire du jour
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Complétez votre questionnaire de suivi. Vos réponses sont transmises
          à votre équipe médicale et archivées dans votre dossier de soins.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-8 lg:px-10">
        <QuestionnaireSection
          templates={templates}
          submissions={patientSubmissions}
        />
      </div>

      <div className="px-6 pb-8 lg:px-10">
        <a
          href="/patient/alertes"
          className="flex items-center justify-between rounded-2xl bg-rose-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Triage d&apos;urgence</p>
            <p className="mt-0.5 text-sm opacity-80">
              Signalez vos symptômes pour une évaluation du niveau de risque.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
