import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { recoveryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PatientParcoursPage() {
  const plans = await recoveryApi.plans();

  return (
    <div>
      {/* Step header */}
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 1/4</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-teal-100 text-teal-800 border-teal-200">
            <Server className="size-3" />
            recovery-plan-service
          </Badge>
          <span>·</span>
          <span>GET /api/recovery-plans/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Votre parcours de soins
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Voici le programme de récupération adapté à votre intervention. Il
          détaille vos objectifs hebdomadaires, les points de vigilance et les
          rôles de votre équipe soignante.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-8 lg:px-10">
        {plans.length === 0 ? (
          <EmptyService service="recovery-plan-service" port="8001" />
        ) : (
          plans.map((plan) => (
            <Card key={plan.slug} className="border-border/60 bg-white shadow-sm">
              <CardHeader className="gap-3 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-teal-100 text-teal-800 border border-teal-200">
                    {plan.specialty}
                  </Badge>
                  <Badge variant="outline">{plan.surgery_type}</Badge>
                </div>
                <CardTitle className="font-heading text-2xl">{plan.title}</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">{plan.overview}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress */}
                <div className="rounded-2xl bg-teal-50 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Durée cible</span>
                    <span className="text-muted-foreground">{plan.target_duration_days} jours</span>
                  </div>
                  <Progress
                    value={Math.min(100, Math.round((21 / plan.target_duration_days) * 100))}
                    className="h-2.5"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Simulation : J+21 sur {plan.target_duration_days} jours
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Weekly objectives */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Objectifs hebdomadaires
                    </p>
                    <ul className="space-y-2">
                      {plan.weekly_objectives.map((obj) => (
                        <li key={obj} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Self-check */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Points de vigilance
                    </p>
                    <ul className="space-y-2">
                      {plan.self_check_prompts.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Care team roles */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Équipe soignante
                    </p>
                    <ul className="space-y-2">
                      {plan.care_team_roles.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
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

        <NextStepBanner
          href="/patient/questionnaire"
          label="Étape suivante : Questionnaire quotidien"
          description="Remplissez votre suivi quotidien de douleur et de fatigue."
          color="teal"
        />
      </div>
    </div>
  );
}

function EmptyService({ service, port }: { service: string; port: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Le service <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{service}</code> (:{port}) est
        hors ligne.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Vérifiez que les conteneurs Docker sont démarrés.
      </p>
    </div>
  );
}

function NextStepBanner({
  href,
  label,
  description,
  color,
}: {
  href: string;
  label: string;
  description: string;
  color: "teal" | "rose" | "indigo" | "amber";
}) {
  const colorMap = {
    teal: "bg-teal-600",
    rose: "bg-rose-600",
    indigo: "bg-indigo-600",
    amber: "bg-amber-500",
  };
  return (
    <a
      href={href}
      className={`flex items-center justify-between rounded-2xl p-5 text-white transition-opacity hover:opacity-90 ${colorMap[color]}`}
    >
      <div>
        <p className="font-semibold">{label}</p>
        <p className="mt-0.5 text-sm opacity-80">{description}</p>
      </div>
      <span className="text-2xl">→</span>
    </a>
  );
}
