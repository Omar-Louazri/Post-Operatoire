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

const ROLE_CHIPS = ["Médecin", "Infirmière", "Kinésithérapeute", "Chirurgien", "Coordinateur"];
const SPECIALTY_CHIPS = ["Orthopédie", "Rééducation", "Chirurgie ambulatoire", "Douleur"];

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

export function NouveauMembreForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState<string | null>(null);

  async function handleSubmit() {
    if (!fullName || !role || !email) {
      setError("Nom, rôle et email sont obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/care-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          role,
          specialty,
          email,
          phone,
          availability,
          is_primary: isPrimary,
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Création impossible.",
        );
      }
      setCreatedName(fullName);
      setFullName(""); setRole(""); setSpecialty(""); setEmail("");
      setPhone(""); setAvailability(""); setIsPrimary(false);
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
            <CardTitle className="font-heading text-xl">Nouveau membre</CardTitle>
            <CardDescription>Ajoutez un soignant au répertoire</CardDescription>
          </div>
          <span className="ml-auto text-muted-foreground">{open ? "▲" : "▼"}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 pt-0">
          {createdName && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-emerald-900">Membre ajouté</AlertTitle>
              <AlertDescription className="text-emerald-800">
                {createdName} a été ajouté à l&apos;équipe soignante.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nm-name">
                Nom complet <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nm-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex. Dr Sophie Martin"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nm-email">
                Email <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="nm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.martin@hopital.fr"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>
                Rôle <span className="text-rose-600">*</span>
              </Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="ex. Kinésithérapeute"
              />
              <SuggestionChips chips={ROLE_CHIPS} onSelect={setRole} />
            </div>
            <div className="grid gap-1.5">
              <Label>Spécialité</Label>
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="ex. Rééducation fonctionnelle"
              />
              <SuggestionChips chips={SPECIALTY_CHIPS} onSelect={setSpecialty} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nm-phone">Téléphone</Label>
              <Input
                id="nm-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nm-avail">Disponibilité</Label>
              <Input
                id="nm-avail"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="ex. Lun–Ven 8h–18h"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-border"
            />
            Référent principal
          </label>

          <Button
            onClick={() => startTransition(() => { void handleSubmit(); })}
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le membre"}
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
