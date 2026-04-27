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

const CHANNEL_CHIPS = ["Appel téléphonique", "Email", "SMS", "Visite", "Portail patient"];
const ROLE_CHIPS = ["Médecin", "Infirmière", "Kinésithérapeute", "Coordinateur"];
const TITLE_CHIPS = [
  "Appel de suivi J+7",
  "Appel de suivi J+14",
  "Appel de suivi J+30",
  "Vérification observance traitement",
  "Prise de rendez-vous rééducation",
  "Envoi du compte-rendu opératoire",
  "Bilan douleur post-opératoire",
  "Contrôle de la cicatrisation",
];

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
          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700 transition hover:bg-amber-100"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

type Props = { defaultPatientCode?: string; availablePatientCodes?: string[] };

export function NouvelleTacheForm({ defaultPatientCode = "", availablePatientCodes }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [patientCode, setPatientCode] = useState(defaultPatientCode);
  const [title, setTitle] = useState("");
  const [responsibleRole, setResponsibleRole] = useState("");
  const [status, setStatus] = useState("planned");
  const [priority, setPriority] = useState("medium");
  const [dueAt, setDueAt] = useState("");
  const [summary, setSummary] = useState("");
  const [channel, setChannel] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  async function handleSubmit() {
    if (!patientCode || !title || !responsibleRole || !dueAt) {
      setError("Code patient, titre, responsable et échéance sont obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/care-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_code: patientCode,
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
          typeof data.error === "string" ? data.error : "Création impossible.",
        );
      }
      setCreatedTitle(title);
      setTitle(""); setResponsibleRole(""); setDueAt("");
      setSummary(""); setChannel(""); setStatus("planned"); setPriority("medium");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-amber-200 bg-white shadow-sm">
      <CardHeader
        className="cursor-pointer select-none pb-4"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-700">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl">Nouvelle tâche</CardTitle>
            <CardDescription>Planifiez une action de coordination</CardDescription>
          </div>
          <span className="ml-auto text-muted-foreground">{open ? "▲" : "▼"}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 pt-0">
          {createdTitle && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-emerald-900">Tâche créée</AlertTitle>
              <AlertDescription className="text-emerald-800">
                « {createdTitle} » a été ajoutée au suivi.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nt-patient">
                Patient <span className="text-rose-600">*</span>
              </Label>
              {availablePatientCodes && availablePatientCodes.length > 0 ? (
                <select
                  id="nt-patient"
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                >
                  <option value="">— Sélectionner un patient —</option>
                  {availablePatientCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id="nt-patient"
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  placeholder="ex. PT-2048"
                />
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nt-title">
                Titre <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nt-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Appel de suivi J+7"
              />
              <SuggestionChips chips={TITLE_CHIPS} onSelect={setTitle} />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Responsable <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                placeholder="ex. Infirmière référente"
              />
              <SuggestionChips chips={ROLE_CHIPS} onSelect={setResponsibleRole} />
            </div>
            <div className="grid gap-1.5">
              <Label>Canal de communication</Label>
              <Input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="ex. Appel téléphonique"
              />
              <SuggestionChips chips={CHANNEL_CHIPS} onSelect={setChannel} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nt-status">Statut</Label>
              <select
                id="nt-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nt-priority">Priorité</Label>
              <select
                id="nt-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="high">Urgent</option>
                <option value="medium">Moyen</option>
                <option value="low">Faible</option>
              </select>
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="nt-due">
                Échéance <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nt-due"
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nt-summary">Description</Label>
            <Textarea
              id="nt-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Détaillez l'objectif et le contexte de cette tâche…"
              className="min-h-16"
            />
          </div>

          <Button
            onClick={() => startTransition(() => { void handleSubmit(); })}
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? "Création en cours..." : "Créer la tâche"}
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
