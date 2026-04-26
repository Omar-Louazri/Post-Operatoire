import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ChirurgienParcoursPage() {
  const plans = await recoveryApi.plans();

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 1/3</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-teal-100 text-teal-800 border-teal-200">
            <Server className="size-3" />
            recovery-plan-service :8001
          </Badge>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Plans de récupération
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Bibliothèque des parcours post-opératoires disponibles. Chaque plan
          définit les objectifs, les points de vigilance et les rôles de
          l&apos;équipe soignante.
        </p>
      </div>

      <div className="space-y-4 px-6 py-8 lg:px-10">
        {plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Service recovery-plan-service (port 8001) hors ligne.
          </div>
        ) : (
          plans.map((plan) => (
            <Card key={plan.slug} className="border-border/60 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-rose-100 text-rose-800 border border-rose-200">
                        {plan.specialty}
                      </Badge>
                      <Badge variant="outline">{plan.surgery_type}</Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {plan.slug}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 font-heading text-xl">{plan.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.overview}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{plan.target_duration_days}</p>
                    <p className="text-xs text-muted-foreground">jours</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress
                  value={Math.min(100, Math.round((21 / plan.target_duration_days) * 100))}
                  className="mb-4 h-2"
                />
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Objectifs
                    </p>
                    <ul className="space-y-1 text-foreground/80">
                      {plan.weekly_objectives.map((o) => (
                        <li key={o} className="flex gap-1.5">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-rose-400" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Vigilance
                    </p>
                    <ul className="space-y-1 text-foreground/80">
                      {plan.self_check_prompts.map((p) => (
                        <li key={p} className="flex gap-1.5">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Équipe
                    </p>
                    <ul className="space-y-1 text-foreground/80">
                      {plan.care_team_roles.map((r) => (
                        <li key={r} className="flex gap-1.5">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-indigo-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <a
          href="/chirurgien/questionnaires"
          className="flex items-center justify-between rounded-2xl bg-rose-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Réponses patients</p>
            <p className="mt-0.5 text-sm opacity-80">
              Consultez les questionnaires soumis et les scores douleur.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
