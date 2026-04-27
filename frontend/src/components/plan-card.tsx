"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { RecoveryPlan } from "@/lib/api";

function calcProgress(plan: RecoveryPlan): number {
  const ref = plan.start_date ?? plan.created_at;
  if (!ref) return 0;
  const elapsed = Math.floor(
    (Date.now() - new Date(ref).getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.min(100, Math.round((elapsed / plan.target_duration_days) * 100));
}

function calcElapsedDays(plan: RecoveryPlan): number {
  const ref = plan.start_date ?? plan.created_at;
  if (!ref) return 0;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(ref).getTime()) / (1000 * 60 * 60 * 24)),
  );
}

type Props = { plan: RecoveryPlan };

export function PlanCard({ plan }: Props) {
  const router = useRouter();

  // ── delete state ──────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── edit state ────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [title, setTitle] = useState(plan.title);
  const [overview, setOverview] = useState(plan.overview);
  const [startDate, setStartDate] = useState(plan.start_date ?? "");
  const [durationDays, setDurationDays] = useState(plan.target_duration_days);
  const [weeklyObjectives, setWeeklyObjectives] = useState(
    plan.weekly_objectives.join("\n"),
  );
  const [selfCheckPrompts, setSelfCheckPrompts] = useState(
    plan.self_check_prompts.join("\n"),
  );
  const [careTeamRoles, setCareTeamRoles] = useState(
    plan.care_team_roles.join("\n"),
  );

  function parseLines(raw: string): string[] {
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/recovery-plan/${plan.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "La suppression a échoué.");
      }
      router.refresh();
    } catch (err) {
      setDeleting(false);
      setConfirmDelete(false);
      setDeleteError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    }
  }

  async function handleSave() {
    setSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/recovery-plan/${plan.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          overview,
          start_date: startDate || null,
          target_duration_days: durationDays,
          weekly_objectives: parseLines(weeklyObjectives),
          self_check_prompts: parseLines(selfCheckPrompts),
          care_team_roles: parseLines(careTeamRoles),
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "La mise à jour a échoué.",
        );
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-border/60 bg-white shadow-sm">
      <CardHeader className="gap-3 pb-4">
        {/* Badges + actions row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-teal-100 text-teal-800 border border-teal-200">
              {plan.specialty}
            </Badge>
            <Badge variant="outline">{plan.surgery_type}</Badge>
            {plan.patient_code && (
              <Badge variant="secondary" className="font-mono text-xs">
                {plan.patient_code}
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-1">
            {!editing && !confirmDelete && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setEditing(true);
                    setDeleteError(null);
                    setEditError(null);
                  }}
                >
                  <Pencil className="size-3.5" />
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => {
                    setConfirmDelete(true);
                    setDeleteError(null);
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Supprimer
                </Button>
              </>
            )}

            {confirmDelete && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5">
                <span className="text-sm font-medium text-rose-800">
                  Confirmer la suppression ?
                </span>
                <Button
                  size="sm"
                  disabled={deleting}
                  className="h-7 bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() =>
                    startTransition(() => {
                      void handleDelete();
                    })
                  }
                >
                  {deleting ? "..." : "Oui, supprimer"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )}

            {editing && (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  disabled={saving}
                  className="h-8 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() =>
                    startTransition(() => {
                      void handleSave();
                    })
                  }
                >
                  <Check className="size-3.5" />
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setEditError(null);
                    setTitle(plan.title);
                    setOverview(plan.overview);
                    setStartDate(plan.start_date ?? "");
                    setDurationDays(plan.target_duration_days);
                    setWeeklyObjectives(plan.weekly_objectives.join("\n"));
                    setSelfCheckPrompts(plan.self_check_prompts.join("\n"));
                    setCareTeamRoles(plan.care_team_roles.join("\n"));
                  }}
                >
                  <X className="size-3.5" />
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </div>

        {deleteError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="size-3.5" />
            <AlertDescription className="text-xs">{deleteError}</AlertDescription>
          </Alert>
        )}

        {/* Title */}
        {editing ? (
          <div className="grid gap-1.5">
            <Label htmlFor={`title-${plan.slug}`} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Titre
            </Label>
            <Input
              id={`title-${plan.slug}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-heading text-xl font-semibold"
            />
          </div>
        ) : (
          <CardTitle className="font-heading text-2xl">{plan.title}</CardTitle>
        )}

        {/* Overview */}
        {editing ? (
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Description générale
            </Label>
            <Textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="min-h-20 text-sm"
            />
          </div>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">{plan.overview}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="rounded-2xl bg-teal-50 p-4">
          {editing ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Durée cible
                  </Label>
                  <span className="text-sm text-muted-foreground">{durationDays} j</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={365}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Date de début
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Progression</span>
                <span className="text-muted-foreground">
                  J+{calcElapsedDays(plan)} / {plan.target_duration_days} jours
                </span>
              </div>
              <Progress value={calcProgress(plan)} className="h-2.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {plan.start_date
                  ? `Démarré le ${new Date(plan.start_date).toLocaleDateString("fr-FR")}`
                  : "Date de début non renseignée"}
              </p>
            </>
          )}
        </div>

        {/* Lists */}
        {editing ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Objectifs hebdomadaires
              </Label>
              <Textarea
                value={weeklyObjectives}
                onChange={(e) => setWeeklyObjectives(e.target.value)}
                placeholder="Un objectif par ligne"
                className="min-h-28 text-sm"
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Points de vigilance
              </Label>
              <Textarea
                value={selfCheckPrompts}
                onChange={(e) => setSelfCheckPrompts(e.target.value)}
                placeholder="Un point par ligne"
                className="min-h-28 text-sm"
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Équipe soignante
              </Label>
              <Textarea
                value={careTeamRoles}
                onChange={(e) => setCareTeamRoles(e.target.value)}
                placeholder="Un rôle par ligne"
                className="min-h-28 text-sm"
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <ListSection
              label="Objectifs hebdomadaires"
              items={plan.weekly_objectives}
              dotColor="bg-teal-500"
            />
            <ListSection
              label="Points de vigilance"
              items={plan.self_check_prompts}
              dotColor="bg-amber-400"
            />
            <ListSection
              label="Équipe soignante"
              items={plan.care_team_roles}
              dotColor="bg-indigo-400"
            />
          </div>
        )}

        {editError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="size-3.5" />
            <AlertDescription className="text-xs">{editError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function ListSection({
  label,
  items,
  dotColor,
}: {
  label: string;
  items: string[];
  dotColor: string;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dotColor}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
