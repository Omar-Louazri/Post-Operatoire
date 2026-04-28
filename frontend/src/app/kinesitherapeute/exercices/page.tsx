import { Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NouveauExerciceForm } from "@/components/nouveau-exercice-form";
import { exerciseApi } from "@/lib/api";

export const dynamic = "force-dynamic";

const phaseColor: Record<string, string> = {
  "Post-op immédiat": "bg-rose-100 text-rose-800 border-rose-200",
  "Semaine 2": "bg-amber-100 text-amber-800 border-amber-200",
  "Cardiaque": "bg-violet-100 text-violet-800 border-violet-200",
};

export default async function KineExercicesPage() {
  const exercises = await exerciseApi.protocols();

  return (
    <div>
      <div className="border-b border-border/50 bg-white/50 px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Étape 1/2</span>
          <span>·</span>
          <Badge variant="outline" className="gap-1 bg-indigo-100 text-indigo-800 border-indigo-200">
            <Server className="size-3" />
            exercise-guidance-service :8003
          </Badge>
          <span>·</span>
          <span>GET /api/exercises/</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Protocoles d&apos;exercices
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Bibliothèque complète des séquences de rééducation. Chaque protocole
          intègre les consignes, le matériel et les critères de validation
          terrain.
        </p>
      </div>

      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <NouveauExerciceForm />
        </div>

        {exercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Service exercise-guidance-service (port 8003) hors ligne.
          </div>
        ) : (
          <>
            {/* Overview grid */}
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {exercises.map((ex, i) => (
                <div
                  key={ex.slug}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-4 shadow-sm"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-tight">{ex.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {ex.duration_minutes} min · {ex.difficulty}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1.5 border text-[10px] ${phaseColor[ex.phase] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {ex.phase}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Full protocols */}
            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Protocoles complets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion multiple={false} className="w-full">
                  {exercises.map((ex) => (
                    <AccordionItem key={ex.slug} value={ex.slug}>
                      <AccordionTrigger>
                        <div className="text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{ex.title}</p>
                            <Badge
                              variant="outline"
                              className={`border text-[10px] ${phaseColor[ex.phase] ?? "bg-muted text-muted-foreground"}`}
                            >
                              {ex.phase}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{ex.summary}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4 pt-2 text-sm md:grid-cols-3">
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Consignes ({ex.instructions.length})
                            </p>
                            <ol className="space-y-2">
                              {ex.instructions.map((inst, i) => (
                                <li key={i} className="flex gap-2 text-foreground/80">
                                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                    {i + 1}
                                  </span>
                                  {inst}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Matériel
                            </p>
                            <ul className="space-y-1.5">
                              {ex.equipment.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-foreground/80">
                                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Validation
                            </p>
                            <ul className="space-y-1.5">
                              {ex.validation_criteria.map((c) => (
                                <li key={c} className="flex items-start gap-2 text-foreground/80">
                                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </>
        )}

        <a
          href="/kinesitherapeute/patients"
          className="mt-6 flex items-center justify-between rounded-2xl bg-indigo-600 p-5 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="font-semibold">Étape suivante : Suivi patients</p>
            <p className="mt-0.5 text-sm opacity-80">
              Consultez les questionnaires d&apos;autonomie et de mobilité.
            </p>
          </div>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
}
