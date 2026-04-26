"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Server } from "lucide-react";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, type RoleConfig } from "@/lib/roles";

type Props = {
  role: RoleConfig;
};

export function RoleStepper({ role }: Props) {
  const pathname = usePathname();
  const c = ROLE_COLORS[role.color];

  const currentIndex = role.steps.findIndex((s) => pathname.startsWith(s.href));
  const prevStep = currentIndex > 0 ? role.steps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < role.steps.length - 1 ? role.steps[currentIndex + 1] : null;

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:gap-5 lg:p-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Changer de rôle
        </Link>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Espace
          </p>
          <h2 className={cn("mt-1 font-heading text-lg font-semibold", c.text)}>
            {role.name}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{role.subtitle}</p>
        </div>

        <div className="flex-1">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Étapes &mdash; {currentIndex + 1}/{role.steps.length}
          </p>
          <ol className="space-y-1">
            {role.steps.map((step, index) => {
              const isActive = index === currentIndex;
              const isDone = index < currentIndex;
              return (
                <li key={step.id}>
                  <Link
                    href={step.href as Route}
                    className={cn(
                      "flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? cn(c.bg, c.text, "font-medium")
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        isActive
                          ? cn(c.activeDot, "text-white")
                          : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="leading-tight">{step.label}</p>
                      <p className="mt-0.5 text-xs leading-tight text-muted-foreground">
                        {step.description}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1.5 h-4 gap-1 px-1.5 text-[10px]",
                          c.badge,
                        )}
                      >
                        <Server className="size-2.5" />
                        {step.service}
                      </Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-2 border-t border-border/50 pt-4">
          {prevStep ? (
            <Link
              href={prevStep.href as Route}
              className="flex w-full items-center justify-start gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              ← {prevStep.label}
            </Link>
          ) : null}
          {nextStep ? (
            <Link
              href={nextStep.href as Route}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90",
                c.activeDot,
              )}
            >
              <span>{nextStep.label}</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              Terminer le parcours
            </Link>
          )}
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Rôles
        </Link>
        <div className="text-center">
          <p className={cn("text-sm font-medium", c.text)}>
            {currentIndex >= 0 ? role.steps[currentIndex]?.label : role.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Étape {currentIndex + 1}/{role.steps.length}
          </p>
        </div>
        <div className="flex gap-2">
          {prevStep ? (
            <Link href={prevStep.href as Route} className="text-sm text-muted-foreground hover:text-foreground">
              ←
            </Link>
          ) : <span className="w-6" />}
          {nextStep ? (
            <Link href={nextStep.href as Route} className={cn("text-sm font-medium", c.text)}>
              →
            </Link>
          ) : <span className="w-6" />}
        </div>
      </div>
    </>
  );
}
