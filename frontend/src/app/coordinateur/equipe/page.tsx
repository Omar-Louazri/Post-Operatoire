import { NouveauMembreForm } from "@/components/nouveau-membre-form";
import { StaffCard } from "@/components/staff-card";
import { TeamAssignmentSection } from "@/components/team-assignment-section";
import { coordinationApi, recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CoordinateurEquipePage() {
  const [contacts, assignments, plans] = await Promise.all([
    coordinationApi.team(),
    coordinationApi.assignments(),
    recoveryApi.plans(),
  ]);

  const patientCodes = [...new Set(assignments.map((a) => a.patient_code))].sort();

  // All distinct patient codes known to the system (from plans + existing assignments)
  const allPatientCodes = [
    ...new Set([
      ...plans.map((p) => p.patient_code),
      ...assignments.map((a) => a.patient_code),
    ]),
  ].sort();

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Coordination · Équipe soignante
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Équipe soignante</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Répertoire de l&apos;équipe de suivi et gestion des affectations par patient.
        </p>
      </div>

      <div className="space-y-10 px-6 py-8 lg:px-10">
        {/* Staff directory */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Répertoire
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <NouveauMembreForm />

          {contacts.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              Aucun soignant dans le répertoire.
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                <strong>{contacts.length}</strong> membre{contacts.length > 1 ? "s" : ""} ·{" "}
                <strong>{contacts.filter((c) => c.is_primary).length}</strong> référent
                {contacts.filter((c) => c.is_primary).length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => (
                  <StaffCard key={contact.id} contact={contact} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Assignments per patient */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Affectations patients
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* New assignment — dropdown pre-filled with known patient codes */}
          {contacts.length > 0 && (
            <TeamAssignmentSection
              contacts={contacts}
              assignments={[]}
              availablePatientCodes={allPatientCodes}
            />
          )}

          {patientCodes.map((code) => (
            <TeamAssignmentSection
              key={code}
              patientCode={code}
              contacts={contacts}
              assignments={assignments.filter((a) => a.patient_code === code)}
            />
          ))}
        </section>

        <a
          href="/coordinateur/taches"
          className="flex items-center justify-between rounded-2xl bg-amber-500 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Tâches de suivi</p>
            <p className="mt-0.5 text-sm opacity-80">
              Planifiez et suivez les tâches de coordination du parcours.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
