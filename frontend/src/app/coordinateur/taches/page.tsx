import { NouvelleTacheForm } from "@/components/nouvelle-tache-form";
import { TaskCard } from "@/components/task-card";
import { coordinationApi, recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const priorityOrder = { high: 3, medium: 2, low: 1 };

export default async function CoordinateurTachesPage() {
  const [tasks, plans, assignments] = await Promise.all([
    coordinationApi.tasks(),
    recoveryApi.plans(),
    coordinationApi.assignments(),
  ]);

  const allPatientCodes = [
    ...new Set([
      ...plans.map((p) => p.patient_code),
      ...assignments.map((a) => a.patient_code),
      ...tasks.map((t) => t.patient_code),
    ]),
  ].sort();
  const sorted = [...tasks].sort(
    (a, b) =>
      (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0),
  );

  const pending = tasks.filter((t) => t.status !== "done").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Coordination · Tâches
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Tâches de coordination</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Planification et suivi de toutes les tâches de coordination du parcours patient.
          Priorisées par urgence clinique.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8 lg:px-10">
        {/* Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total", value: tasks.length, color: "text-foreground" },
            { label: "En attente", value: pending, color: "text-amber-600" },
            { label: "Terminées", value: done, color: "text-emerald-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-white px-5 py-4 shadow-sm"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Create form */}
        <NouvelleTacheForm availablePatientCodes={allPatientCodes} />

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Tâches en cours
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Aucune tâche planifiée.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        <a
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-white p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground shadow-sm"
        >
          ← Retour à l&apos;accueil · Choisir un autre rôle
        </a>
      </div>
    </div>
  );
}
