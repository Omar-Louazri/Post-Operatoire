import { Mail, Phone } from "lucide-react";
import { NouveauProgrammeForm } from "@/components/nouveau-programme-form";
import { PlanCard } from "@/components/plan-card";
import { Badge } from "@/components/ui/badge";
import { coordinationApi, recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const PATIENT_CODE = "PT-2048";

export default async function PatientParcoursPage() {
  const [plans, assignments] = await Promise.all([
    recoveryApi.plans(PATIENT_CODE),
    coordinationApi.assignments(PATIENT_CODE),
  ]);

  return (
    <div>
      {/* En-tête */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
          Dossier patient · {PATIENT_CODE}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Votre parcours de soins
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Consultez votre programme de récupération personnalisé ou créez-en un
          nouveau en collaboration avec votre équipe médicale.
        </p>
      </div>

      {/* Contenu */}
      <div className="space-y-6 px-6 py-8 lg:px-10">
        {/* Formulaire de création */}
        <NouveauProgrammeForm defaultPatientCode={PATIENT_CODE} />

        {/* Séparateur */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Programmes existants
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Liste des plans */}
        {plans.length === 0 ? (
          <EmptyPlans />
        ) : (
          plans.map((plan) => <PlanCard key={plan.slug} plan={plan} />)
        )}

        {/* Équipe assignée */}
        {assignments.length > 0 && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Votre équipe soignante
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-xl border bg-white p-4 shadow-sm ${a.contact.is_primary ? "border-teal-300 ring-1 ring-teal-200" : "border-border/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                      {a.contact.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="font-medium">{a.contact.full_name}</p>
                        {a.contact.is_primary && (
                          <Badge className="bg-teal-600 text-xs text-white">Référent</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{a.role_on_case}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                      <Mail className="size-3 shrink-0" />
                      <span className="truncate">{a.contact.email}</span>
                    </div>
                    {a.contact.phone && (
                      <div className="flex items-center gap-2 text-xs text-foreground/70">
                        <Phone className="size-3 shrink-0" />
                        {a.contact.phone}
                      </div>
                    )}
                    <p className="rounded-md bg-teal-50 px-2.5 py-1 text-xs text-teal-800">
                      {a.contact.availability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bannière étape suivante */}
        <a
          href="/patient/questionnaire"
          className="flex items-center justify-between rounded-2xl bg-teal-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Questionnaire quotidien</p>
            <p className="mt-0.5 text-sm opacity-80">
              Remplissez votre suivi quotidien de douleur et de fatigue.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}

function EmptyPlans() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Aucun programme trouvé pour ce patient.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Utilisez le formulaire ci-dessus pour créer votre premier programme de récupération.
      </p>
    </div>
  );
}
