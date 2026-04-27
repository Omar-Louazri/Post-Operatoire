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

const AUDIENCE_CHIPS = ["Patient", "Kinésithérapeute", "Médecin", "Infirmière"];
const CADENCE_CHIPS = ["Quotidien", "Hebdomadaire", "Mensuel", "À la demande"];

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

export function NouveauTemplateForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [cadence, setCadence] = useState("");
  const [introText, setIntroText] = useState("");
  const [validatedBy, setValidatedBy] = useState("");
  const [questionsText, setQuestionsText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  function parseQuestions(raw: string) {
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [label = "", type = "text", req = "optionnel"] = line
          .split("|")
          .map((s) => s.trim());
        return { label, type, required: req === "requis" };
      });
  }

  async function handleSubmit() {
    if (!title || !audience || !cadence || !introText) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questionnaire-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audience,
          cadence,
          intro_text: introText,
          medically_validated_by: validatedBy,
          questions: parseQuestions(questionsText),
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
      setAudience("");
      setCadence("");
      setIntroText("");
      setValidatedBy("");
      setQuestionsText("");
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
              Nouveau questionnaire
            </CardTitle>
            <CardDescription>
              Créez un modèle de questionnaire de suivi
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
              <AlertTitle className="text-emerald-900">Questionnaire créé</AlertTitle>
              <AlertDescription className="text-emerald-800">
                « {createdTitle} » a été ajouté à la bibliothèque.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nt-title">
                Titre <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nt-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Bilan hebdomadaire mobilité"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nt-validated">Validé par</Label>
              <Input
                id="nt-validated"
                value={validatedBy}
                onChange={(e) => setValidatedBy(e.target.value)}
                placeholder="ex. Comité douleur et rééducation"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Destinataire <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="ex. Patient"
              />
              <SuggestionChips chips={AUDIENCE_CHIPS} onSelect={setAudience} />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Fréquence <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                placeholder="ex. Hebdomadaire"
              />
              <SuggestionChips chips={CADENCE_CHIPS} onSelect={setCadence} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nt-intro">
              Texte d&apos;introduction <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="nt-intro"
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Décrivez l'objectif de ce questionnaire..."
              className="min-h-16"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nt-questions">Questions</Label>
            <Textarea
              id="nt-questions"
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="min-h-28 font-mono text-xs"
              placeholder={"Label | type | requis\nex. Douleur | scale | requis\nex. Fièvre | boolean | optionnel\nex. Observations | textarea | optionnel"}
            />
            <p className="text-xs text-muted-foreground">
              Format : <code className="rounded bg-muted px-1">Label | type | requis/optionnel</code> — types : <code className="rounded bg-muted px-1">scale</code>, <code className="rounded bg-muted px-1">boolean</code>, <code className="rounded bg-muted px-1">text</code>, <code className="rounded bg-muted px-1">textarea</code>
            </p>
          </div>

          <Button
            onClick={() => startTransition(() => { void handleSubmit(); })}
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? "Création en cours..." : "Créer le questionnaire"}
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
