"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, Check, MessageSquare, Pencil, Trash2, User, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CareCoordinationTask } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  planned: "Planifié",
  in_progress: "En cours",
  done: "Terminé",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Urgent",
  medium: "Moyen",
  low: "Faible",
};

const STATUS_COLORS: Record<string, string> = {
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  planned: "bg-slate-100 text-slate-700 border-slate-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-rose-100 text-rose-800 border-rose-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

type Props = { task: CareCoordinationTask };

export function TaskCard({ task }: Props) {
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [title, setTitle] = useState(task.title);
  const [responsibleRole, setResponsibleRole] = useState(task.responsible_role);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueAt, setDueAt] = useState(task.due_at ? task.due_at.slice(0, 16) : "");
  const [summary, setSummary] = useState(task.summary);
  const [channel, setChannel] = useState(task.channel);

  function resetEdit() {
    setTitle(task.title);
    setResponsibleRole(task.responsible_role);
    setStatus(task.status);
    setPriority(task.priority);
    setDueAt(task.due_at ? task.due_at.slice(0, 16) : "");
    setSummary(task.summary);
    setChannel(task.channel);
    setEditing(false);
    setEditError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/care-task/${task.id}`, { method: "DELETE" });
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
      const res = await fetch(`/api/care-task/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          responsible_role: responsibleRole,
          status,
          priority,
          due_at: dueAt,
          summary,
          channel,
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
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${task.priority === "high" && task.status !== "done" ? "border-rose-200 ring-1 ring-rose-100" : "border-border/60"}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {!editing && (
            <>
              <Badge variant="outline" className="font-mono text-xs">{task.patient_code}</Badge>
              <Badge variant="outline" className={`border text-xs ${PRIORITY_COLORS[task.priority] ?? ""}`}>
                {PRIORITY_LABELS[task.priority] ?? task.priority}
              </Badge>
              <Badge variant="outline" className={`border text-xs ${STATUS_COLORS[task.status] ?? ""}`}>
                {STATUS_LABELS[task.status] ?? task.status}
              </Badge>
            </>
          )}
        </div>

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
                className="h-6 bg-rose-600 px-2 text-xs text-white hover:bg-rose-700"
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
                className="h-7 gap-1 bg-amber-600 px-2 text-xs text-white hover:bg-amber-700"
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
          <p className="mt-2 font-medium">{task.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{task.summary}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3" />
              {task.responsible_role}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-3" />
              {task.channel}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              {new Date(task.due_at).toLocaleString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Titre <span className="text-rose-500">*</span>
              </Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Statut
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CareCoordinationTask["status"])}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Priorité
              </Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CareCoordinationTask["priority"])}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="high">Urgent</option>
                <option value="medium">Moyen</option>
                <option value="low">Faible</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Responsable
              </Label>
              <Input value={responsibleRole} onChange={(e) => setResponsibleRole(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Canal
              </Label>
              <Input value={channel} onChange={(e) => setChannel(e.target.value)} className="text-sm" placeholder="ex. Appel, Email, SMS" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Échéance
              </Label>
              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Description
            </Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-16 text-sm" />
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
