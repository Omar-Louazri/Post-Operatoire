"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Mail, Pencil, Phone, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CareTeamContact } from "@/lib/api";

type Props = { contact: CareTeamContact };

export function StaffCard({ contact }: Props) {
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(contact.full_name);
  const [role, setRole] = useState(contact.role);
  const [specialty, setSpecialty] = useState(contact.specialty);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [availability, setAvailability] = useState(contact.availability);
  const [isPrimary, setIsPrimary] = useState(contact.is_primary);

  function resetEdit() {
    setFullName(contact.full_name);
    setRole(contact.role);
    setSpecialty(contact.specialty);
    setEmail(contact.email);
    setPhone(contact.phone);
    setAvailability(contact.availability);
    setIsPrimary(contact.is_primary);
    setEditing(false);
    setEditError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/care-contact/${contact.id}`, { method: "DELETE" });
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
      const res = await fetch(`/api/care-contact/${contact.id}`, {
        method: "PATCH",
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

  const initials = contact.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${contact.is_primary ? "border-amber-300 ring-1 ring-amber-200" : "border-border/60"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
            {initials}
          </div>
          {!editing && (
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-medium">{contact.full_name}</p>
                {contact.is_primary && (
                  <Badge className="bg-amber-500 text-xs text-white">Référent</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
              {contact.specialty && (
                <p className="text-xs text-muted-foreground">{contact.specialty}</p>
              )}
            </div>
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
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
            {contact.phone}
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            {contact.availability}
          </div>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Nom complet <span className="text-rose-500">*</span>
              </Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Rôle
              </Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} className="text-sm" placeholder="ex. Médecin, Infirmière" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Spécialité
              </Label>
              <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Téléphone
              </Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Disponibilité
              </Label>
              <Input value={availability} onChange={(e) => setAvailability(e.target.value)} className="text-sm" placeholder="ex. Lun–Ven 8h–18h" />
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
