"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Pencil, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionnaireSubmission } from "@/lib/api";

const statusLabel: Record<string, string> = {
  submitted: "Soumis",
  pending: "En attente",
  escalated: "Escaladé",
};

const statusColor: Record<string, string> = {
  submitted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  escalated: "bg-rose-100 text-rose-800 border-rose-200",
};

type Props = { submission: QuestionnaireSubmission };

export function SubmissionCard({ submission }: Props) {
  const router = useRouter();

  // ── delete state ──────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── edit state ────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [status, setStatus] = useState(submission.status);
  const [painScore, setPainScore] = useState(submission.pain_score ?? 0);
  const [freeText, setFreeText] = useState(submission.free_text ?? "");

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/questionnaire-submission/${submission.id}`, {
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
      const res = await fetch(`/api/questionnaire-submission/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, pain_score: painScore, free_text: freeText }),
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
      setEditError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      {/* Header row: badges + actions */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={`border text-xs ${statusColor[submission.status] ?? "bg-muted text-foreground"}`}
          >
            {statusLabel[submission.status] ?? submission.status}
          </Badge>
          {submission.pain_score !== null && (
            <Badge variant="secondary" className="text-xs">
              Douleur {submission.pain_score}/10
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
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setEditing(true);
                  setDeleteError(null);
                  setEditError(null);
                  setStatus(submission.status);
                  setPainScore(submission.pain_score ?? 0);
                  setFreeText(submission.free_text ?? "");
                }}
              >
                <Pencil className="size-3" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => {
                  setConfirmDelete(true);
                  setDeleteError(null);
                }}
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
                onClick={() =>
                  startTransition(() => {
                    void handleDelete();
                  })
                }
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
                className="h-7 gap-1 bg-teal-600 px-2 text-xs hover:bg-teal-700 text-white"
                onClick={() =>
                  startTransition(() => {
                    void handleSave();
                  })
                }
              >
                <Check className="size-3" />
                {saving ? "..." : "Enregistrer"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-1"
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                <X className="size-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Submission title */}
      <p className="mt-1.5 text-sm font-medium">{submission.template.title}</p>

      {/* Edit form */}
      {editing ? (
        <div className="mt-3 space-y-3">
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Statut
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="escalated">Escaladé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Score de douleur
              </Label>
              <span className="text-xs text-muted-foreground">{painScore}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Notes libres
            </Label>
            <Textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Observations ou commentaires..."
              className="min-h-16 text-xs"
            />
          </div>

          {editError && (
            <Alert variant="destructive" className="py-1.5">
              <AlertCircle className="size-3" />
              <AlertDescription className="text-xs">{editError}</AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <>
          {submission.free_text && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {submission.free_text}
            </p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            {new Date(submission.submitted_at).toLocaleString("fr-FR")}
          </p>
        </>
      )}

      {deleteError && (
        <Alert variant="destructive" className="mt-2 py-1.5">
          <AlertCircle className="size-3" />
          <AlertDescription className="text-xs">{deleteError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
