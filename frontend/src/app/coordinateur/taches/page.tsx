import { Calendar, MessageSquare, Server, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coordinationApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  planned: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabel: Record<string, string> = {
  done: "Terminé",
  in_progress: "En cours",
  planned: "Planifié",
};

const priorityColor: Record<string, string> = {
  high: "bg-rose-100 text-rose-800 border-rose-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const priorityLabel: Record<string, string> = {
  high: "Urgent",
  medium: "Moyen",
  low: "Faible",
};

const priorityOrder = { high: 3, medium: 2, low: 1 };

export default async function CoordinateurTachesPage() {
  const tasks = await coordinationApi.tasks();
  const sorted = [...tasks].sort(
    (a, b) =>
      (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0),
  );

  const pending = tasks.filter((t) => t.status !== "done").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 2/2</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-amber-100 text-amber-800 border-amber-200">
            <Server className="size-3" />
            care-coordination-service :8005
          </Badge>
          <span>·</span>
          <span>GET /api/care-tasks/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Tâches de coordination
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Planification et suivi de toutes les tâches de coordination du
          parcours patient. Priorisées par urgence clinique.
        </p>
      </div>

      <div className="px-6 py-8 lg:px-10">
        {/* Summary */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total", value: tasks.length, color: "text-foreground" },
            { label: "En attente", value: pending, color: "text-amber-600" },
            { label: "Terminées", value: done, color: "text-emerald-600" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-white shadow-sm">
              <CardContent className="pt-5">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Service care-coordination-service (port 8005) hors ligne.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((task) => (
              <Card
                key={`${task.patient_code}-${task.title}`}
                className={`border-border/60 bg-white shadow-sm ${task.priority === "high" && task.status !== "done" ? "ring-1 ring-rose-200" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {task.patient_code}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`border text-xs ${priorityColor[task.priority] ?? ""}`}
                    >
                      {priorityLabel[task.priority] ?? task.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`border text-xs ${statusColor[task.status] ?? ""}`}
                    >
                      {statusLabel[task.status] ?? task.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{task.summary}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3" />
                      {task.responsible_role}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="size-3" />
                      {task.channel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      {new Date(task.due_at).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <a
          href="/"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-white p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground shadow-sm"
        >
          ← Retour à l&apos;accueil · Choisir un autre rôle
        </a>
      </div>
    </div>
  );
}
