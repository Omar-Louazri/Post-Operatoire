"use client";

import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionnaireForm } from "@/components/questionnaire-form";
import { SubmissionCard } from "@/components/submission-card";
import type { QuestionnaireSubmission, QuestionnaireTemplate } from "@/lib/api";

const questionTypeLabel: Record<string, string> = {
  scale: "Échelle",
  boolean: "Oui / Non",
  textarea: "Texte libre",
  text: "Réponse courte",
};

type Props = {
  templates: QuestionnaireTemplate[];
  submissions: QuestionnaireSubmission[];
};

export function QuestionnaireSection({ templates, submissions }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    templates[0]?.slug ?? "",
  );

  const selectedTemplate = templates.find((t) => t.slug === selectedSlug);

  const typeCounts = selectedTemplate
    ? selectedTemplate.questions.reduce<Record<string, number>>((acc, q) => {
        acc[q.type] = (acc[q.type] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* ── Left: form ─────────────────────────────────────────────────── */}
      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
          Aucun questionnaire disponible pour le moment. Revenez plus tard ou
          contactez votre équipe médicale.
        </div>
      ) : (
        <QuestionnaireForm
          templates={templates}
          selectedSlug={selectedSlug}
          onTemplateChange={setSelectedSlug}
        />
      )}

      {/* ── Right: info panel + history ────────────────────────────────── */}
      <div className="space-y-4">
        {/* Dynamic template info */}
        {selectedTemplate ? (
          <Card className="border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-teal-100 p-2 text-teal-700">
                  <ClipboardList className="size-4" />
                </div>
                <CardTitle className="text-base leading-tight">
                  {selectedTemplate.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {selectedTemplate.intro_text}
              </p>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <Users className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Destinataire
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {selectedTemplate.audience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Fréquence
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {selectedTemplate.cadence}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <BookOpen className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Questions
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {selectedTemplate.questions.length} au total
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Validé par
                    </p>
                    <p className="mt-0.5 text-sm font-medium leading-tight">
                      {selectedTemplate.medically_validated_by}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question type breakdown */}
              {Object.keys(typeCounts).length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Types de questions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-xs"
                      >
                        {count}× {questionTypeLabel[type] ?? type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/60 bg-white shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Sélectionnez un questionnaire pour afficher ses informations.
            </CardContent>
          </Card>
        )}

        {/* Submission history */}
        <Card className="border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mes réponses récentes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Vos 5 dernières soumissions
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune soumission enregistrée.
              </p>
            ) : (
              submissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
