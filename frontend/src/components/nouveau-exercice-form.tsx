"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, PlusCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export function NouveauExerciceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [summary, setSummary] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [criteriaText, setCriteriaText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  async function handleSubmit() {
    if (!title || !phase || !difficulty || !durationMinutes || !summary) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
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
          typeof data.error === "string" ? data.error : "Création impossible.",
        );
      }
      setCreatedTitle(title);
      setTitle("");
      setPhase("");
      setDifficulty("");
      setDurationMinutes("");
      setSummary("");
      setEquipmentText("");
      setInstructionsText("");
      setCriteriaText("");
      setMediaUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-indigo-200 bg-white shadow-sm">
      <CardHeader
        className="cursor-pointer select-none pb-4"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2.5 text-indigo-700">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl">
              Nouveau protocole
            </CardTitle>
            <CardDescription>
              Ajoutez un exercice à la bibliothèque de rééducation
            </CardDescription>
          </div>
          <span className="ml-auto text-muted-foreground">{open ? "▲" : "▼"}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 pt-0">
          {createdTitle && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-emerald-900">Protocole créé</AlertTitle>
              <AlertDescription className="text-emerald-800">
                « {createdTitle} » a été ajouté à la bibliothèque.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="ne-title">
                Titre <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="ne-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Flexion genou assistée"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Phase <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                placeholder="ex. Post-op immédiat"
              />
              <SuggestionChips chips={PHASE_CHIPS} onSelect={setPhase} />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Difficulté <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="ex. Débutant"
              />
              <SuggestionChips chips={DIFFICULTY_CHIPS} onSelect={setDifficulty} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ne-duration">
                Durée (min) <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="ne-duration"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="ex. 15"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ne-media">URL média</Label>
              <Input
                id="ne-media"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ne-summary">
              Résumé <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="ne-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Description courte du protocole..."
              className="min-h-16"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ne-equipment">Matériel</Label>
              <Textarea
                id="ne-equipment"
                value={equipmentText}
                onChange={(e) => setEquipmentText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"Coussin\nBande élastique\n..."}
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ne-instructions">Consignes</Label>
              <Textarea
                id="ne-instructions"
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"S'allonger sur le dos\nFléchir le genou à 90°\n..."}
              />
              <p className="text-xs text-muted-foreground">Une étape par ligne</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ne-criteria">Critères de validation</Label>
              <Textarea
                id="ne-criteria"
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                className="min-h-24 font-mono text-xs"
                placeholder={"Amplitude ≥ 90°\nDouleur ≤ 3/10\n..."}
              />
              <p className="text-xs text-muted-foreground">Un critère par ligne</p>
            </div>
          </div>

          <Button
            onClick={() => startTransition(() => { void handleSubmit(); })}
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? "Création en cours..." : "Ajouter le protocole"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      )}
    </Card>
  );
}
