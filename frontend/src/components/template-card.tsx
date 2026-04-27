"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Pencil, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionnaireTemplate } from "@/lib/api";

type Question = { label: string; type: string; required: boolean };

function questionsToText(questions: Question[]): string {
  return questions
    .map((q) => `${q.label} | ${q.type} | ${q.required ? "requis" : "optionnel"}`)
    .join("\n");
}

function textToQuestions(raw: string): Question[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", type = "text", req = "optionnel"] = line
        .split("|")
        .map((s) => s.trim());
      return { label, type, required: req === "requis" };
    });
}

type Props = { template: QuestionnaireTemplate };

export function TemplateCard({ template }: Props) {
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [title, setTitle] = useState(template.title);
  const [audience, setAudience] = useState(template.audience);
  const [cadence, setCadence] = useState(template.cadence);
  const [introText, setIntroText] = useState(template.intro_text);
  const [validatedBy, setValidatedBy] = useState(template.medically_validated_by);
  const [questionsText, setQuestionsText] = useState(
    questionsToText(template.questions),
  );

  function resetEdit() {
    setTitle(template.title);
    setAudience(template.audience);
    setCadence(template.cadence);
    setIntroText(template.intro_text);
    setValidatedBy(template.medically_validated_by);
    setQuestionsText(questionsToText(template.questions));
    setEditing(false);
    setEditError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/questionnaire-template/${template.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "La suppression a échoué.");
      }
      router.refresh();
    } catch (err) {
      setDeleting(false);
      setConfirmDelete(false);
      setDeleteError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  async function handleSave() {
    setSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/questionnaire-template/${template.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audience,
          cadence,
          intro_text: introText,
          medically_validated_by: validatedBy,
          questions: textToQuestions(questionsText),
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "La mise à jour a échoué.",
        );
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-indigo-50/50 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {!editing && (
            <>
              <p className="font-medium">{template.title}</p>
              <Badge variant="outline" className="text-xs">{template.cadence}</Badge>
              <Badge variant="secondary" className="text-xs">{template.audience}</Badge>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1">
          {!editing && !confirmDelete && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => { setEditing(true); setDeleteError(null); setEditError(null); }}
              >
                <Pencil className="size-3" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => { setConfirmDelete(true); setDeleteError(null); }}
              >
                <Trash2 className="size-3" />
                Supprimer
              </Button>
            </>
          )}

          {confirmDelete && (
            <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1">
              <span className="text-xs font-medium text-rose-800">Confirmer ?</span>
              <Button
                size="sm"
                disabled={deleting}
                className="h-6 bg-rose-600 px-2 text-xs hover:bg-rose-700 text-white"
                onClick={() => startTransition(() => { void handleDelete(); })}
              >
                {deleting ? "..." : "Oui"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
              >
                <X className="size-3" />
              </Button>
            </div>
          )}

          {editing && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                disabled={saving}
                className="h-7 gap-1 bg-indigo-600 px-2 text-xs hover:bg-indigo-700 text-white"
                onClick={() => startTransition(() => { void handleSave(); })}
              >
                <Check className="size-3" />
                {saving ? "..." : "Enregistrer"}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-1" disabled={saving} onClick={resetEdit}>
                <X className="size-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {deleteError && (
        <Alert variant="destructive" className="mt-2 py-1.5">
          <AlertCircle className="size-3" />
          <AlertDescription className="text-xs">{deleteError}</AlertDescription>
        </Alert>
      )}

      {/* Read view */}
      {!editing && (
        <>
          <p className="mt-2 text-sm text-muted-foreground">{template.intro_text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {template.questions.map((q) => (
              <span
                key={q.label}
                className="rounded-md border border-border/40 bg-white px-2 py-0.5 text-xs text-foreground/70"
              >
                {q.label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Validé par : {template.medically_validated_by}
          </p>
        </>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Titre <span className="text-rose-500">*</span>
              </Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Destinataire
              </Label>
              <Input value={audience} onChange={(e) => setAudience(e.target.value)} className="text-sm" placeholder="ex. Patient, Kinésithérapeute" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Fréquence
              </Label>
              <Input value={cadence} onChange={(e) => setCadence(e.target.value)} className="text-sm" placeholder="ex. Quotidien, Hebdomadaire" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Validé par
              </Label>
              <Input value={validatedBy} onChange={(e) => setValidatedBy(e.target.value)} className="text-sm" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Introduction
            </Label>
            <Textarea value={introText} onChange={(e) => setIntroText(e.target.value)} className="min-h-16 text-sm" />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Questions
            </Label>
            <Textarea
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="min-h-24 font-mono text-xs"
              placeholder={"Label | type | requis\nex. Douleur | scale | requis\nex. Fièvre | boolean | optionnel"}
            />
            <p className="text-xs text-muted-foreground">
              Format : <code className="rounded bg-muted px-1">Label | type | requis/optionnel</code> — types : <code className="rounded bg-muted px-1">scale</code>, <code className="rounded bg-muted px-1">boolean</code>, <code className="rounded bg-muted px-1">text</code>, <code className="rounded bg-muted px-1">textarea</code>
            </p>
          </div>

          {editError && (
            <Alert variant="destructive" className="py-1.5">
              <AlertCircle className="size-3" />
              <AlertDescription className="text-xs">{editError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
