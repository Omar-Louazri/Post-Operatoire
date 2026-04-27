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

const SPECIALTIES = [
  "Orthopédie",
  "Cardiologie",
  "Neurologie",
  "Chirurgie digestive",
  "Rhumatologie",
];

const SURGERY_TYPES = [
  "Prothèse totale de genou (PTG)",
  "Prothèse totale de hanche (PTH)",
  "Arthroscopie du genou",
  "Bypass coronarien",
  "Hernie discale lombaire",
];

const TITLE_SUGGESTIONS = [
  "Rééducation post-PTG",
  "Rééducation post-PTH",
  "Récupération post-arthroscopie",
  "Réhabilitation cardiaque post-bypass",
];

const OBJECTIVE_CHIPS = [
  "Marcher 15 min/jour",
  "Exercices de flexion quotidiens",
  "Réduire la douleur à < 3/10",
  "Monter les escaliers sans aide",
  "Reprendre les activités légères",
];

const CHECK_CHIPS = [
  "Surveiller la rougeur",
  "Prendre la température matin et soir",
  "Vérifier l'œdème du membre",
  "Consulter si douleur > 7/10",
  "Surveiller la cicatrisation",
];

const TEAM_CHIPS = [
  "Chirurgien référent",
  "Kinésithérapeute",
  "Médecin traitant",
  "Infirmière coordinatrice",
  "Psychologue de soutien",
];

const OVERVIEW_CHIPS = [
  "Programme de rééducation post-opératoire visant à restaurer la mobilité et réduire la douleur.",
  "Suivi post-chirurgical incluant kinésithérapie, surveillance de la cicatrisation et reprise progressive des activités.",
  "Protocole de réhabilitation cardiaque après intervention, axé sur la reprise progressive de l'effort.",
  "Plan de récupération après chirurgie orthopédique avec objectifs fonctionnels hebdomadaires.",
];

function SuggestionChips({
  chips,
  onAdd,
}: {
  chips: string[];
  onAdd: (chip: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onAdd(chip)}
          className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs text-teal-700 transition hover:bg-teal-100 hover:border-teal-400"
        >
          + {chip}
        </button>
      ))}
    </div>
  );
}

type Props = {
  defaultPatientCode?: string;
  onCreated?: () => void;
};

export function NouveauProgrammeForm({ defaultPatientCode = "PT-2048", onCreated }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [patientCode, setPatientCode] = useState(defaultPatientCode);
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [surgeryType, setSurgeryType] = useState("");
  const [durationDays, setDurationDays] = useState(90);
  const [startDate, setStartDate] = useState("");
  const [overview, setOverview] = useState("");
  const [weeklyObjectives, setWeeklyObjectives] = useState("");
  const [selfCheckPrompts, setSelfCheckPrompts] = useState("");
  const [careTeamRoles, setCareTeamRoles] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);

  function parseLines(raw: string): string[] {
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }

  function appendLine(current: string, chip: string): string {
    if (!current.trim()) return chip;
    if (current.endsWith("\n")) return current + chip;
    return current + "\n" + chip;
  }

  async function handleSubmit() {
    if (!title || !specialty || !surgeryType || !overview) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/recovery-plan-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_code: patientCode,
          title,
          specialty,
          surgery_type: surgeryType,
          target_duration_days: durationDays,
          start_date: startDate || null,
          overview,
          weekly_objectives: parseLines(weeklyObjectives),
          self_check_prompts: parseLines(selfCheckPrompts),
          care_team_roles: parseLines(careTeamRoles),
        }),
      });
      const data = (await res.json()) as { id?: number; error?: unknown };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Création impossible. Vérifiez les champs.",
        );
      }
      setCreatedId(data.id ?? null);
      setTitle("");
      setSpecialty("");
      setSurgeryType("");
      setDurationDays(90);
      setStartDate("");
      setOverview("");
      setWeeklyObjectives("");
      setSelfCheckPrompts("");
      setCareTeamRoles("");
      router.refresh();
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-teal-200 bg-white shadow-sm">
      {/* Datalists for native browser autocomplete */}
      <datalist id="dl-specialty">
        {SPECIALTIES.map((s) => <option key={s} value={s} />)}
      </datalist>
      <datalist id="dl-surgery">
        {SURGERY_TYPES.map((s) => <option key={s} value={s} />)}
      </datalist>
      <datalist id="dl-title">
        {TITLE_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
      </datalist>

      <CardHeader
        className="cursor-pointer select-none pb-4"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-teal-100 p-2.5 text-teal-700">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <CardTitle className="font-heading text-xl">
              Ajouter un programme
            </CardTitle>
            <CardDescription>
              Créez un nouveau programme de récupération pour le patient
            </CardDescription>
          </div>
          <span className="ml-auto text-muted-foreground">{open ? "▲" : "▼"}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-5 pt-0">
          {createdId && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-emerald-900">Programme créé</AlertTitle>
              <AlertDescription className="text-emerald-800">
                Le programme #{createdId} a été enregistré. Rechargez la page pour le consulter.
              </AlertDescription>
            </Alert>
          )}

          {/* Ligne 1 : code patient + spécialité */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="np-patient">
                Code patient <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="np-patient"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="PT-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-specialty">
                Spécialité <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="np-specialty"
                list="dl-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="ex. Orthopédie"
              />
            </div>
          </div>

          {/* Ligne 2 : titre + type opération */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="np-title">
                Titre du programme <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="np-title"
                list="dl-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Rééducation post-PTG"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-surgery">
                Type d&apos;opération <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="np-surgery"
                list="dl-surgery"
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
                placeholder="ex. Prothèse totale de genou"
              />
            </div>
          </div>

          {/* Ligne 3 : durée + date de début */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="np-duration">Durée cible (jours)</Label>
                <span className="text-sm text-muted-foreground">{durationDays} j</span>
              </div>
              <input
                id="np-duration"
                type="range"
                min={14}
                max={365}
                step={1}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-start">Date de début</Label>
              <Input
                id="np-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="np-overview">
              Description générale <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="np-overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Décrivez le programme de récupération..."
              className="min-h-20"
            />
            <SuggestionChips
              chips={OVERVIEW_CHIPS}
              onAdd={(chip) => setOverview(chip)}
            />
          </div>

          {/* Listes */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="np-obj">Objectifs hebdomadaires</Label>
              <Textarea
                id="np-obj"
                value={weeklyObjectives}
                onChange={(e) => setWeeklyObjectives(e.target.value)}
                placeholder={"Un objectif par ligne\nex. Marcher 15 min/jour"}
                className="min-h-28 text-sm"
              />
              <SuggestionChips
                chips={OBJECTIVE_CHIPS}
                onAdd={(chip) => setWeeklyObjectives((v) => appendLine(v, chip))}
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-check">Points de vigilance</Label>
              <Textarea
                id="np-check"
                value={selfCheckPrompts}
                onChange={(e) => setSelfCheckPrompts(e.target.value)}
                placeholder={"ex. Surveiller la rougeur\nex. Prendre la température"}
                className="min-h-28 text-sm"
              />
              <SuggestionChips
                chips={CHECK_CHIPS}
                onAdd={(chip) => setSelfCheckPrompts((v) => appendLine(v, chip))}
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="np-team">Équipe soignante</Label>
              <Textarea
                id="np-team"
                value={careTeamRoles}
                onChange={(e) => setCareTeamRoles(e.target.value)}
                placeholder={"ex. Chirurgien : Dr. Martin\nex. Kinésithérapeute"}
                className="min-h-28 text-sm"
              />
              <SuggestionChips
                chips={TEAM_CHIPS}
                onAdd={(chip) => setCareTeamRoles((v) => appendLine(v, chip))}
              />
              <p className="text-xs text-muted-foreground">Un item par ligne</p>
            </div>
          </div>

          <Button
            onClick={() =>
              startTransition(() => {
                void handleSubmit();
              })
            }
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-teal-600 hover:bg-teal-700"
          >
            {isSubmitting ? "Enregistrement..." : "Créer le programme"}
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
