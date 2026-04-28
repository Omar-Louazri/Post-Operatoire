"use client";

import { startTransition, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Siren,
  Trash2,
  X,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AlertAssessment } from "@/lib/api";

const severityColor: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800 border-rose-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const severityLabel: Record<string, string> = {
  critical: "CRITIQUE",
  high: "ÉLEVÉ",
  medium: "MODÉRÉ",
  low: "FAIBLE",
};

type FormState = {
  pain_level: number;
  has_fever: boolean;
  bleeding_level: string;
  swelling_level: string;
  notes: string;
};

const defaultForm: FormState = {
  pain_level: 3,
  has_fever: false,
  bleeding_level: "none",
  swelling_level: "0",
  notes: "",
};

type EvalResult = {
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

function EvaluationForm({
  patientCode,
  initial,
  onSuccess,
  onCancel,
  replaceId,
}: {
  patientCode: string;
  initial: FormState;
  onSuccess: (assessment: AlertAssessment) => void;
  onCancel: () => void;
  replaceId?: number;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_code: patientCode,
          pain_level: form.pain_level,
          has_fever: form.has_fever,
          bleeding_level: form.bleeding_level,
          swelling_level: Number(form.swelling_level),
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Évaluation indisponible.");
      }

      const evalResult = (await res.json()) as EvalResult;
      setResult(evalResult);

      if (replaceId !== undefined) {
        await fetch(`/api/assessment/${replaceId}`, { method: "DELETE" });
      }

      const newAssessment: AlertAssessment = {
        id: evalResult.assessment_id,
        patient_code: patientCode,
        pain_level: form.pain_level,
        has_fever: form.has_fever,
        bleeding_level: form.bleeding_level as AlertAssessment["bleeding_level"],
        swelling_level: Number(form.swelling_level),
        notes: form.notes,
        computed_severity: evalResult.computed_severity as AlertAssessment["computed_severity"],
        triggered_rules: evalResult.triggered_rules,
        care_recommendation: evalResult.care_recommendation,
        created_at: new Date().toISOString(),
      };

      onSuccess(newAssessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-primary/10 bg-white shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {replaceId !== undefined ? "Modifier l'évaluation" : "Nouvelle évaluation"}
          </CardTitle>
          <Button variant="ghost" size="icon" className="size-7" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-900 font-medium">
                Évaluation enregistrée — #{result.assessment_id}
              </p>
            </div>
            <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${severityColor[result.computed_severity] ?? ""}`}>
              <div className="flex items-center gap-2">
                <Siren className="size-4" />
                Sévérité : {severityLabel[result.computed_severity] ?? result.computed_severity}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.care_recommendation}</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { startTransition(() => { void handleSubmit(e); }); }}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Douleur déclarée</Label>
                <span className="text-sm text-muted-foreground">{form.pain_level}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={form.pain_level}
                onChange={(e) => set("pain_level", Number(e.target.value))}
                className="w-full accent-[oklch(0.49_0.111_202.77)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Saignement</Label>
                <Select value={form.bleeding_level} onValueChange={(v) => set("bleeding_level", v ?? "none")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="light">Léger</SelectItem>
                    <SelectItem value="moderate">Modéré</SelectItem>
                    <SelectItem value="severe">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Œdème</Label>
                <Select value={form.swelling_level} onValueChange={(v) => set("swelling_level", v ?? "0")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Absent</SelectItem>
                    <SelectItem value="1">Léger</SelectItem>
                    <SelectItem value="2">Modéré</SelectItem>
                    <SelectItem value="3">Marqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3">
              <Checkbox
                id="fever"
                checked={form.has_fever}
                onCheckedChange={(v) => set("has_fever", Boolean(v))}
              />
              <Label htmlFor="fever" className="cursor-pointer text-sm">
                Fièvre ou température anormale
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Notes complémentaires</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Contexte, observations, symptômes supplémentaires..."
                className="min-h-20"
              />
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
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Évaluation..." : replaceId !== undefined ? "Sauvegarder" : "Évaluer"}
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function AssessmentCard({
  assessment,
  onEdit,
  onDelete,
}: {
  assessment: AlertAssessment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirmDelete() {
    setConfirmOpen(false);
    setDeleting(true);
    startTransition(() => {
      void fetch(`/api/assessment/${assessment.id}`, { method: "DELETE" })
        .then(() => onDelete())
        .catch(() => setDeleting(false));
    });
  }

  return (
    <>
    <Card className={`border-border/60 bg-white shadow-sm transition-opacity ${deleting ? "opacity-40 pointer-events-none" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Siren className="size-4 text-rose-500" />
              <CardTitle className="text-sm font-semibold">
                Évaluation #{assessment.id}
              </CardTitle>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(assessment.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`shrink-0 text-[10px] border ${severityColor[assessment.computed_severity] ?? ""}`}
            >
              {severityLabel[assessment.computed_severity] ?? assessment.computed_severity}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={onEdit}
              title="Modifier"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-rose-600"
              onClick={() => setConfirmOpen(true)}
              title="Supprimer"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Douleur", value: `${assessment.pain_level}/10` },
            { label: "Fièvre", value: assessment.has_fever ? "Oui" : "Non" },
            { label: "Saignement", value: assessment.bleeding_level },
            { label: "Œdème", value: `${assessment.swelling_level}/3` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/40 px-2.5 py-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-xs font-semibold capitalize">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-sky-50/70 border border-sky-100 px-3 py-2 text-xs text-foreground/80">
          {assessment.care_recommendation}
        </div>

        {assessment.notes && (
          <p className="text-xs italic text-muted-foreground">
            &ldquo;{assessment.notes}&rdquo;
          </p>
        )}

        {assessment.triggered_rules.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Règles déclenchées ({assessment.triggered_rules.length})
            </p>
            {assessment.triggered_rules.map((rule) => (
              <div
                key={rule.code}
                className="flex items-start gap-2 rounded-lg border border-border/60 bg-card px-3 py-2"
              >
                <Badge variant="outline" className="shrink-0 text-[9px] mt-0.5">
                  {rule.code}
                </Badge>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{rule.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{rule.immediate_action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;évaluation</DialogTitle>
          <DialogDescription>
            L&apos;évaluation <strong>#{assessment.id}</strong> sera définitivement
            supprimée. Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export function AssessmentManager({
  patientCode,
  initial,
}: {
  patientCode: string;
  initial: AlertAssessment[];
}) {
  const [assessments, setAssessments] = useState<AlertAssessment[]>(initial);
  const [mode, setMode] = useState<"idle" | "create" | { edit: number }>( "idle");

  function handleCreated(a: AlertAssessment) {
    setAssessments((prev) => [a, ...prev]);
    setMode("idle");
  }

  function handleEdited(a: AlertAssessment, replacedId: number) {
    setAssessments((prev) => [a, ...prev.filter((x) => x.id !== replacedId)]);
    setMode("idle");
  }

  function handleDeleted(id: number) {
    setAssessments((prev) => prev.filter((x) => x.id !== id));
  }

  const editingId = typeof mode === "object" ? mode.edit : undefined;
  const editingAssessment = editingId !== undefined
    ? assessments.find((a) => a.id === editingId)
    : undefined;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          {assessments.length} évaluation{assessments.length !== 1 ? "s" : ""} enregistrée{assessments.length !== 1 ? "s" : ""}
        </p>
        {mode === "idle" && (
          <Button
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={() => setMode("create")}
          >
            <Plus className="size-3.5" />
            Nouvelle évaluation
          </Button>
        )}
      </div>

      {/* Create form */}
      {mode === "create" && (
        <EvaluationForm
          patientCode={patientCode}
          initial={defaultForm}
          onSuccess={handleCreated}
          onCancel={() => setMode("idle")}
        />
      )}

      {/* Edit form */}
      {typeof mode === "object" && editingAssessment && (
        <EvaluationForm
          patientCode={patientCode}
          initial={{
            pain_level: editingAssessment.pain_level,
            has_fever: editingAssessment.has_fever,
            bleeding_level: editingAssessment.bleeding_level,
            swelling_level: String(editingAssessment.swelling_level),
            notes: editingAssessment.notes,
          }}
          replaceId={editingAssessment.id}
          onSuccess={(a) => handleEdited(a, editingAssessment.id)}
          onCancel={() => setMode("idle")}
        />
      )}

      {/* List */}
      {assessments.length === 0 && mode === "idle" ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
          <Siren className="mx-auto size-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium text-foreground/50">
            Aucune évaluation enregistrée
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cliquez sur « Nouvelle évaluation » pour décrire vos symptômes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((a) => (
            <AssessmentCard
              key={a.id}
              assessment={a}
              onEdit={() => setMode({ edit: a.id })}
              onDelete={() => handleDeleted(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
