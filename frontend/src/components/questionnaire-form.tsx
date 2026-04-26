"use client";

import { startTransition, useState } from "react";
import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { QuestionnaireTemplate } from "@/lib/api";

type Props = {
  templates: QuestionnaireTemplate[];
};

type AnswerValue = string | number | boolean;

export function QuestionnaireForm({ templates }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    templates[0]?.slug ?? "",
  );
  const [patientCode, setPatientCode] = useState("PT-2048");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [painScore, setPainScore] = useState(0);
  const [freeText, setFreeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const selectedTemplate = templates.find((t) => t.slug === selectedSlug);

  function handleTemplateChange(slug: string | null) {
    if (!slug) return;
    setSelectedSlug(slug);
    setAnswers({});
    setError(null);
    setSubmittedId(null);
  }

  function setAnswer(label: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  }

  async function handleSubmit() {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/questionnaire-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_code: patientCode,
          template_slug: selectedSlug,
          answers,
          pain_score: painScore,
          free_text: freeText,
          status: "submitted",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Soumission impossible.");
      }

      const data = (await response.json()) as { id: number };
      setSubmittedId(data.id);
      setAnswers({});
      setFreeText("");
      setPainScore(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">
              Saisir une reponse
            </CardTitle>
            <CardDescription>
              Completez un questionnaire pour un patient et enregistrez les
              reponses.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {submittedId ? (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="size-4 text-emerald-700" />
            <AlertTitle className="text-emerald-900">
              Soumission enregistree
            </AlertTitle>
            <AlertDescription className="text-emerald-800">
              Reponse #{submittedId} enregistree pour {patientCode}. Rechargez
              la page pour voir les soumissions mises a jour.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Questionnaire</Label>
            <Select value={selectedSlug} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un questionnaire" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.slug} value={t.slug}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qf-patient">Code patient</Label>
            <Input
              id="qf-patient"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              placeholder="PT-0000"
            />
          </div>
        </div>

        {selectedTemplate ? (
          <div className="space-y-4 rounded-[1.4rem] border border-border/80 bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              {selectedTemplate.intro_text}
            </p>
            {selectedTemplate.questions.map((q) => (
              <div key={q.label} className="grid gap-2">
                <Label>
                  {q.label}
                  {q.required ? (
                    <span className="ml-1 text-rose-600">*</span>
                  ) : null}
                </Label>
                {q.type === "scale" ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>0</span>
                      <span className="font-medium text-foreground">
                        {String(answers[q.label] ?? 0)}/10
                      </span>
                      <span>10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={Number(answers[q.label] ?? 0)}
                      onChange={(e) =>
                        setAnswer(q.label, Number(e.target.value))
                      }
                      className="w-full accent-[oklch(0.49_0.111_202.77)]"
                    />
                  </div>
                ) : q.type === "boolean" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/60 px-4 py-3">
                    <Checkbox
                      id={`q-${q.label}`}
                      checked={Boolean(answers[q.label] ?? false)}
                      onCheckedChange={(checked) =>
                        setAnswer(q.label, Boolean(checked))
                      }
                    />
                    <Label htmlFor={`q-${q.label}`} className="cursor-pointer font-normal">
                      Oui
                    </Label>
                  </div>
                ) : q.type === "textarea" ? (
                  <Textarea
                    value={String(answers[q.label] ?? "")}
                    onChange={(e) => setAnswer(q.label, e.target.value)}
                    placeholder="Votre observation..."
                    className="min-h-20"
                  />
                ) : (
                  <Input
                    value={String(answers[q.label] ?? "")}
                    onChange={(e) => setAnswer(q.label, e.target.value)}
                    placeholder="Votre reponse..."
                  />
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Score de douleur global</Label>
              <span className="text-sm text-muted-foreground">
                {painScore}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="accent-[oklch(0.49_0.111_202.77)]"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="qf-freetext">Notes libres</Label>
          <Textarea
            id="qf-freetext"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Commentaires ou observations supplementaires..."
            className="min-h-20"
          />
        </div>

        <Button
          onClick={() =>
            startTransition(() => {
              void handleSubmit();
            })
          }
          disabled={isSubmitting || !selectedTemplate}
          className="h-11 w-full rounded-full"
        >
          {isSubmitting ? "Enregistrement..." : "Soumettre le questionnaire"}
        </Button>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {selectedTemplate ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">{selectedTemplate.audience}</Badge>
            <Badge variant="outline">{selectedTemplate.cadence}</Badge>
            <Badge variant="outline" className="text-muted-foreground">
              Valide: {selectedTemplate.medically_validated_by}
            </Badge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
