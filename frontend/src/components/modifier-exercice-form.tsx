"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExerciseProtocol } from "@/lib/api";

const PHASE_CHIPS = ["Post-op immédiat", "Semaine 2", "Cardiaque", "Semaine 4+"];
const DIFFICULTY_CHIPS = ["Débutant", "Intermédiaire", "Avancé"];

function SuggestionChips({
  chips,
  onSelect,
}: {
  chips: string[];
  onSelect: (chip: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700 transition hover:bg-indigo-100"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function joinLines(arr: string[]): string {
  return arr.join("\n");
}

export function ModifierExerciceForm({ exercise }: { exercise: ExerciseProtocol }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(exercise.title);
  const [phase, setPhase] = useState(exercise.phase);
  const [difficulty, setDifficulty] = useState(exercise.difficulty);
  const [durationMinutes, setDurationMinutes] = useState(String(exercise.duration_minutes));
  const [summary, setSummary] = useState(exercise.summary);
  const [equipmentText, setEquipmentText] = useState(joinLines(exercise.equipment));
  const [instructionsText, setInstructionsText] = useState(joinLines(exercise.instructions));
  const [criteriaText, setCriteriaText] = useState(joinLines(exercise.validation_criteria));
  const [mediaUrl, setMediaUrl] = useState(exercise.media_url ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!title || !phase || !difficulty || !durationMinutes || !summary) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/exercise/${exercise.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          phase,
          difficulty,
          duration_minutes: parseInt(durationMinutes, 10),
          summary,
          equipment: parseLines(equipmentText),
          instructions: parseLines(instructionsText),
          validation_criteria: parseLines(criteriaText),
          media_url: mediaUrl || undefined,
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Mise à jour impossible.",
        );
      }
      setSaved(true);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Supprimer le protocole « ${exercise.title} » ? Cette action est irréversible.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/exercise/${exercise.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-4 border-t border-border/50 pt-4">
      {!open ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-1.5 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Pencil className="size-3.5" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startTransition(() => { void handleDelete(); })}
            disabled={isDeleting}
            className="gap-1.5 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="size-3.5" />
            {isDeleting ? "Suppression…" : "Supprimer"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Modifier le protocole
          </p>

          {saved && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-emerald-900">Enregistré</AlertTitle>
              <AlertDescription className="text-emerald-800">
                Le protocole a été mis à jour.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label>Titre <span className="text-rose-600">*</span></Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Phase <span className="text-rose-600">*</span></Label>
              <Input value={phase} onChange={(e) => setPhase(e.target.value)} />
              <SuggestionChips chips={PHASE_CHIPS} onSelect={setPhase} />
            </div>
            <div className="grid gap-1.5">
              <Label>Difficulté <span className="text-rose-600">*</span></Label>
              <Input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
              <SuggestionChips chips={DIFFICULTY_CHIPS} onSelect={setDifficulty} />
            </div>
            <div className="grid gap-1.5">
              <Label>Durée (min) <span className="text-rose-600">*</span></Label>
              <Input
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>URL média</Label>
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Résumé <span className="text-rose-600">*</span></Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-16"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label>Matériel</Label>
              <Textarea
                value={equipmentText}
                onChange={(e) => setEquipmentText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"Coussin\nBande élastique\n..."}
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Consignes</Label>
              <Textarea
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"S'allonger\nFléchir le genou\n..."}
              />
              <p className="text-xs text-muted-foreground">Une étape par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Critères de validation</Label>
              <Textarea
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"Amplitude ≥ 90°\nDouleur ≤ 3/10\n..."}
              />
              <p className="text-xs text-muted-foreground">Un critère par ligne</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => startTransition(() => { void handleSave(); })}
              disabled={isSubmitting}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setOpen(false); setError(null); setSaved(false); }}
              className="rounded-full"
            >
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={() => startTransition(() => { void handleDelete(); })}
              disabled={isDeleting}
              className="ml-auto rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="size-3.5" />
              {isDeleting ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
