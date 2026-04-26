"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { AlertCircle, Siren, Thermometer } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EvaluationResponse = {
  assessment_id: number;
  computed_severity: string;
  care_recommendation: string;
  triggered_rules: Array<{
    code: string;
    title: string;
    severity: string;
    immediate_action: string;
  }>;
};

const severityClasses: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-900",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-orange-100 text-orange-900",
  critical: "bg-rose-100 text-rose-900",
};

export function SymptomChecker() {
  const [patientCode, setPatientCode] = useState("PT-2048");
  const [painLevel, setPainLevel] = useState(4);
  const [hasFever, setHasFever] = useState(false);
  const [bleedingLevel, setBleedingLevel] = useState("none");
  const [swellingLevel, setSwellingLevel] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResponse | null>(null);

  const deferredNotes = useDeferredValue(notes);

  async function submitAssessment() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_code: patientCode,
          pain_level: painLevel,
          has_fever: hasFever,
          bleeding_level: bleedingLevel,
          swelling_level: Number(swellingLevel),
          notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Evaluation indisponible.");
      }

      setResult((await response.json()) as EvaluationResponse);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Une erreur est survenue pendant l evaluation.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-primary/10 bg-white/90 shadow-lg shadow-primary/5">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-2xl">
              Triage rapide post-op
            </CardTitle>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Simulez une evaluation clinique a partir des indicateurs de
              douleur, temperature, saignement et oedeme.
            </p>
          </div>
          <Badge variant="secondary" className="bg-secondary/70 text-foreground">
            <Thermometer className="mr-1 size-4" />
            Temps reel
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(() => {
              void submitAssessment();
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="patientCode">Code patient</Label>
            <Input
              id="patientCode"
              value={patientCode}
              onChange={(event) => setPatientCode(event.target.value)}
              placeholder="PT-2048"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="painLevel">Douleur declaree</Label>
              <span className="text-sm text-muted-foreground">{painLevel}/10</span>
            </div>
            <input
              id="painLevel"
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(event) => setPainLevel(Number(event.target.value))}
              className="accent-[oklch(0.49_0.111_202.77)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Niveau de saignement</Label>
              <Select
                value={bleedingLevel}
                onValueChange={(value) => setBleedingLevel(value ?? "none")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="light">Leger</SelectItem>
                  <SelectItem value="moderate">Modere</SelectItem>
                  <SelectItem value="severe">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Niveau d&apos;oedeme</Label>
              <Select
                value={swellingLevel}
                onValueChange={(value) => setSwellingLevel(value ?? "0")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Absent</SelectItem>
                  <SelectItem value="1">Mild</SelectItem>
                  <SelectItem value="2">Modere</SelectItem>
                  <SelectItem value="3">Marque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 px-4 py-3">
            <Checkbox
              id="hasFever"
              checked={hasFever}
              onCheckedChange={(checked) => setHasFever(Boolean(checked))}
            />
            <Label htmlFor="hasFever" className="cursor-pointer">
              Fievre signalee ou temperature anormale
            </Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes de suivi</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Exemple: douleur plus vive la nuit, rougeur localisee, fatigue inhabituelle..."
              className="min-h-28"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Evaluation en cours..." : "Evaluer le risque"}
          </Button>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Service indisponible</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </form>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-dashed border-primary/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(236,245,244,0.9))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
              Lecture clinique
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {deferredNotes
                ? deferredNotes
                : "Ajoutez un contexte clinique libre pour enrichir votre evaluation."}
            </p>
          </div>

          {result ? (
            <Card className="border-primary/15 bg-background/95 shadow-none">
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">Resultat de l&apos;alerte</CardTitle>
                  <Badge
                    className={
                      severityClasses[result.computed_severity] ??
                      "bg-muted text-foreground"
                    }
                  >
                    <Siren className="mr-1 size-4" />
                    {result.computed_severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dossier {patientCode} · evaluation #{result.assessment_id}
                </p>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-2xl bg-secondary/50 p-4 text-sm leading-7 text-foreground/90">
                  {result.care_recommendation}
                </div>
                <div className="grid gap-3">
                  {result.triggered_rules.length ? (
                    result.triggered_rules.map((rule) => (
                      <div
                        key={rule.code}
                        className="rounded-2xl border border-border/80 bg-card p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{rule.title}</p>
                          <Badge variant="outline">{rule.code}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {rule.immediate_action}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucune regle d&apos;alerte critique declenchee.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Sortie attendue
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                L&apos;API de complications renverra un niveau de severite, les regles
                declenchees et une recommandation d&apos;escalade ou de surveillance.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
