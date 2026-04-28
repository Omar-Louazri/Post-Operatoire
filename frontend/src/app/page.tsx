import {
  Activity,
  Check,
  HeartPulse,
  Stethoscope,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ROLES, ROLE_COLORS, type RoleConfig } from "@/lib/roles";

const ROLE_ICONS = {
  patient: UserRound,
  chirurgien: Stethoscope,
  kinesitherapeute: Activity,
  coordinateur: Users,
};

function RoleCard({ role }: { role: RoleConfig }) {
  const c = ROLE_COLORS[role.color];
  const Icon = ROLE_ICONS[role.id as keyof typeof ROLE_ICONS] ?? UserRound;

  return (
    <a
      href={role.href}
      className={cn(
        "group relative flex flex-col gap-6 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        c.cardHover,
      )}
    >
      {/* Top accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-3xl",
          c.activeDot,
        )}
      />

      {/* Icon + Role name */}
      <div className="flex items-start justify-between">
        <div>
          <div
            className={cn(
              "mb-4 flex size-14 items-center justify-center rounded-2xl",
              c.iconBg,
              c.iconText,
            )}
          >
            <Icon className="size-7" />
          </div>
          <h3 className="font-heading text-2xl font-semibold text-foreground">
            {role.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{role.subtitle}</p>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            c.badge,
          )}
        >
          {role.steps.length} étapes
        </span>
      </div>

      {/* Capabilities */}
      <ul className="flex-1 space-y-2">
        {role.capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className={cn("mt-0.5 size-4 shrink-0", c.iconText)} />
            {cap}
          </li>
        ))}
      </ul>

      {/* Steps preview */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Parcours microservices
        </p>
        <div className="flex flex-wrap gap-1.5">
          {role.steps.map((step, i) => (
            <span
              key={step.id}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <span
                className={cn(
                  "flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white",
                  c.activeDot,
                )}
              >
                {i + 1}
              </span>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className={cn(
          "flex h-11 items-center justify-center rounded-xl text-sm font-medium text-white transition-opacity group-hover:opacity-90",
          c.activeDot,
        )}
      >
        Accéder à mon espace →
      </div>
    </a>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="size-5" />
            </div>
            <span className="font-heading text-xl font-semibold">
              PostOp<span className="text-primary">Care</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-6 pt-16">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="size-4 text-primary" />
          Architecture de haute qualité, orientée utilisateur
        </div>
        <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-tight tracking-tight text-foreground">
          Accompagner le patient après l&apos;intervention, pas à pas.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Choisissez votre profil pour explorer les microservices dédiés à votre
          rôle dans le parcours post-opératoire.
        </p>
      </section>

      {/* Role cards */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ROLES.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        {/* Architecture info */}
        <div className="mt-12 rounded-3xl border border-border/60 bg-white/60 p-8">
          <h2 className="font-heading text-xl font-semibold">
            Architecture des microservices
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque étape de chaque rôle interagit avec un microservice distinct.
            Les données sont chargées en temps réel depuis les APIs Django REST Framework.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "recovery-plan-service", port: "8001", color: "bg-teal-100 text-teal-800 border-teal-200", desc: "Parcours post-op" },
              { name: "questionnaire-service", port: "8002", color: "bg-violet-100 text-violet-800 border-violet-200", desc: "Suivi clinique" },
              { name: "exercise-guidance-service", port: "8003", color: "bg-indigo-100 text-indigo-800 border-indigo-200", desc: "Rééducation" },
              { name: "complication-alert-service", port: "8004", color: "bg-rose-100 text-rose-800 border-rose-200", desc: "Alertes" },
              { name: "care-coordination-service", port: "8005", color: "bg-amber-100 text-amber-800 border-amber-200", desc: "Coordination" },
            ].map((svc) => (
              <div
                key={svc.name}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-xs",
                  svc.color,
                )}
              >
                <p className="font-mono font-semibold">{svc.name}</p>
                <p className="mt-0.5 font-medium">:{svc.port}</p>
                <p className="mt-1 text-[11px] opacity-80">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        PostOpCare &mdash; Usage clinique interne &mdash; Données de démonstration
      </footer>
    </div>
  );
}
