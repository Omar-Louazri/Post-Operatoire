import { Mail, Phone, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coordinationApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CoordinateurEquipePage() {
  const contacts = await coordinationApi.team();

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 1/2</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-amber-100 text-amber-800 border-amber-200">
            <Server className="size-3" />
            care-coordination-service :8005
          </Badge>
          <span>·</span>
          <span>GET /api/care-team/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Équipe soignante
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Répertoire complet de l&apos;équipe de suivi avec les coordonnées,
          spécialités et plages de disponibilité.
        </p>
      </div>

      <div className="px-6 py-8 lg:px-10">
        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Service care-coordination-service (port 8005) hors ligne.
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <strong>{contacts.length}</strong> membre{contacts.length > 1 ? "s" : ""} dans
                l&apos;équipe ·{" "}
                <strong>{contacts.filter((c) => c.is_primary).length}</strong> référent
                {contacts.filter((c) => c.is_primary).length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact) => (
                <Card
                  key={contact.email}
                  className={`border-border/60 bg-white shadow-sm ${contact.is_primary ? "ring-2 ring-amber-400/50" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                        {contact.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <CardTitle className="text-base">{contact.full_name}</CardTitle>
                          {contact.is_primary && (
                            <Badge className="bg-amber-500 text-white text-xs">
                              Référent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        {contact.specialty && (
                          <p className="text-xs text-muted-foreground">{contact.specialty}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <a
          href="/coordinateur/taches"
          className="mt-6 flex items-center justify-between rounded-2xl bg-amber-500 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Tâches de suivi</p>
            <p className="mt-0.5 text-sm opacity-80">
              Planifiez et suivez les tâches de coordination du parcours.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
