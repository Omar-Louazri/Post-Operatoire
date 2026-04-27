"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, PlusCircle, Trash2, X } from "lucide-react";

const ROLE_CHIPS = [
  "Médecin référent",
  "Chirurgien traitant",
  "Kinésithérapeute référent",
  "Infirmière coordinatrice",
  "Coordinateur de parcours",
];

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CareTeamContact, PatientCareAssignment } from "@/lib/api";

type Props = {
  patientCode?: string;
  availablePatientCodes?: string[];
  contacts: CareTeamContact[];
  assignments: PatientCareAssignment[];
};

export function TeamAssignmentSection({ patientCode: initialCode, availablePatientCodes, contacts, assignments }: Props) {
  const router = useRouter();

  const [addOpen, setAddOpen] = useState(!initialCode);
  const [editableCode, setEditableCode] = useState(initialCode ?? "");
  const patientCode = initialCode ?? editableCode;
  const [contactId, setContactId] = useState("");
  const [roleOnCase, setRoleOnCase] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleAdd() {
    const code = initialCode ?? editableCode;
    if (!code) {
      setAddError("Veuillez sélectionner un patient.");
      return;
    }
    if (!contactId) {
      setAddError("Veuillez sélectionner un soignant.");
      return;
    }
    if (!roleOnCase) {
      setAddError("Veuillez préciser le rôle sur ce dossier.");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/care-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_code: code,
          contact_id: Number(contactId),
          role_on_case: roleOnCase,
          notes,
        }),
      });
      const data = (await res.json()) as { error?: unknown };
      if (!res.ok) {
        const msg = typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error);
        throw new Error(msg ?? "Affectation impossible.");
      }
      setContactId(""); setRoleOnCase(""); setNotes("");
      setAddOpen(false);
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/care-assignment/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Suppression impossible.");
      }
      setConfirmId(null);
      router.refresh();
    } catch (err) {
      setDeletingId(null);
      setConfirmId(null);
      setDeleteError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  const unassignedContacts = contacts.filter(
    (c) => !assignments.some((a) => a.contact.id === c.id),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {initialCode
            ? `Soignants assignés · ${initialCode}`
            : "Nouvelle affectation"}
        </h3>
        {initialCode && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 border-amber-200 text-xs text-amber-700 hover:bg-amber-50"
            onClick={() => setAddOpen((v) => !v)}
          >
            <PlusCircle className="size-3" />
            Affecter
          </Button>
        )}
      </div>

      {deleteError && (
        <Alert variant="destructive" className="py-1.5">
          <AlertCircle className="size-3" />
          <AlertDescription className="text-xs">{deleteError}</AlertDescription>
        </Alert>
      )}

      {addOpen && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {!initialCode && (
              <div className="grid gap-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Patient <span className="text-rose-500">*</span>
                </Label>
                {availablePatientCodes && availablePatientCodes.length > 0 ? (
                  <select
                    value={editableCode}
                    onChange={(e) => setEditableCode(e.target.value)}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">— Sélectionner un patient —</option>
                    {availablePatientCodes.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={editableCode}
                    onChange={(e) => setEditableCode(e.target.value)}
                    placeholder="ex. PT-2048"
                    className="text-sm"
                  />
                )}
              </div>
            )}
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Soignant <span className="text-rose-500">*</span>
              </Label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">— Choisir —</option>
                {unassignedContacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} · {c.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Rôle sur ce dossier <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={roleOnCase}
                onChange={(e) => setRoleOnCase(e.target.value)}
                placeholder="ex. Kinésithérapeute référent"
                className="text-sm"
              />
              <div className="flex flex-wrap gap-1.5">
                {ROLE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRoleOnCase(chip)}
                    className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700 transition hover:bg-amber-100"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Notes
            </Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires…"
              className="text-sm"
            />
          </div>
          {addError && (
            <Alert variant="destructive" className="py-1.5">
              <AlertCircle className="size-3" />
              <AlertDescription className="text-xs">{addError}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={adding}
              className="bg-amber-600 text-xs text-white hover:bg-amber-700"
              onClick={() => startTransition(() => { void handleAdd(); })}
            >
              {adding ? "..." : "Confirmer l'affectation"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => { setAddOpen(false); setAddError(null); }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {assignments.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Aucun soignant assigné à ce patient.
        </p>
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {a.contact.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{a.contact.full_name}</p>
                  <p className="text-xs text-muted-foreground">{a.role_on_case}</p>
                </div>
                <Badge variant="outline" className="text-xs">{a.contact.role}</Badge>
                {a.notes && (
                  <span className="text-xs text-muted-foreground">— {a.notes}</span>
                )}
              </div>

              {confirmId === a.id ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1">
                  <span className="text-xs font-medium text-rose-800">Confirmer ?</span>
                  <Button
                    size="sm"
                    disabled={deletingId === a.id}
                    className="h-6 bg-rose-600 px-2 text-xs text-white hover:bg-rose-700"
                    onClick={() => startTransition(() => { void handleDelete(a.id); })}
                  >
                    {deletingId === a.id ? "..." : "Oui"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1"
                    onClick={() => setConfirmId(null)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setConfirmId(a.id)}
                >
                  <Trash2 className="size-3" />
                  Retirer
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
