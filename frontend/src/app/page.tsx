import {
  Activity,
  ClipboardList,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymptomChecker } from "@/components/symptom-checker";
import { getDashboardData } from "@/lib/api";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const metricCards = [
  {
    label: "Acteurs couverts",
    value: "4",
    description: "Patients, chirurgiens, kines et coordinateurs",
    icon: UsersRound,
  },
  {
    label: "Microservices",
    value: "5",
    description: "Architecture modulaire pour le suivi post-op",
    icon: Activity,
  },
  {
    label: "Livrables cliniques",
    value: "3",
    description: "Parcours, questionnaires et Docker Compose",
    icon: ClipboardList,
  },
];

export default async function Home() {
  const { alertRules, contacts, exercises, plans, questionnaires, services, tasks } =
    await getDashboardData();

  const onlineCount = services.filter((service) => service.online).length;

  return (
    <main className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur">
              <HeartPulse className="size-4 text-primary" />
              Application de suivi post-operatoire et de reeducation
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-heading text-5xl leading-none tracking-tight text-balance text-foreground sm:text-6xl">
                Accompagner le patient apres l&apos;intervention, sans perdre le fil
                du parcours clinique.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Une base moderne Next.js 16 + Django 6 pour suivre les
                questionnaires, guider les exercices, detecter les complications
                et aligner tous les professionnels du suivi.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#plateforme"
                className={cn(
                  buttonVariants(),
                  "h-12 rounded-full px-6 text-base",
                )}
              >
                Explorer la plateforme
              </a>
              <a
                href="#alertes"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-full border-primary/20 bg-white/70 px-6 text-base",
                )}
              >
                Tester le triage
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.label} className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                    <CardContent className="flex items-start justify-between gap-4 p-5">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-secondary/70 p-3 text-primary">
                        <Icon className="size-5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="overflow-hidden border-primary/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(235,245,244,0.92))] shadow-xl shadow-primary/5">
            <CardHeader className="gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription>Etat d&apos;orchestration</CardDescription>
                  <CardTitle className="mt-2 font-heading text-3xl">
                    {onlineCount}/5 services disponibles
                  </CardTitle>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  Docker compose ready
                </Badge>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Le frontend agrege les donnees de chaque microservice avec des
                vues dediees pour les patients, les chirurgiens, les kines et les
                coordinateurs de parcours.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {services.map((service) => (
                <div key={service.name} className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <Badge
                      variant={service.online ? "default" : "secondary"}
                      className={
                        service.online
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-100 text-amber-900"
                      }
                    >
                      {service.online ? "En ligne" : "Hors ligne"}
                    </Badge>
                  </div>
                </div>
              ))}
              <Separator />
              <div>
                <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Couverture fonctionnelle initiale</span>
                  <span>82%</span>
                </div>
                <Progress value={82} className="h-3 bg-secondary/70" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="border-primary/10 bg-white/85">
          <Stethoscope className="size-4 text-primary" />
          <AlertTitle>Baseline clinique prechargee</AlertTitle>
          <AlertDescription>
            Deux parcours post-op, deux questionnaires valides medicalement, des
            exercices guides, des regles d&apos;alerte et des taches de coordination
            sont semes automatiquement au demarrage.
          </AlertDescription>
        </Alert>
      </section>

      <section id="plateforme" className="mx-auto max-w-7xl px-6 lg:px-8">
        <Tabs defaultValue="parcours" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-[1.5rem] bg-white/80 p-2 shadow-sm md:grid-cols-5">
            <TabsTrigger value="parcours" className="rounded-[1.1rem] py-3">
              Parcours
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="rounded-[1.1rem] py-3">
              Questionnaires
            </TabsTrigger>
            <TabsTrigger value="exercices" className="rounded-[1.1rem] py-3">
              Exercices
            </TabsTrigger>
            <TabsTrigger value="alertes" className="rounded-[1.1rem] py-3">
              Alertes
            </TabsTrigger>
            <TabsTrigger value="coordination" className="rounded-[1.1rem] py-3">
              Coordination
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parcours" className="grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.slug} className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {plan.specialty}
                    </Badge>
                    <Badge variant="outline">{plan.surgery_type}</Badge>
                  </div>
                  <div>
                    <CardTitle className="font-heading text-3xl">
                      {plan.title}
                    </CardTitle>
                    <CardDescription className="mt-3 text-sm leading-7">
                      {plan.overview}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-[1.4rem] bg-secondary/45 p-4">
                    <p className="text-sm font-medium text-foreground">
                      Duree cible: {plan.target_duration_days} jours
                    </p>
                    <Progress
                      value={Math.min(100, Math.round((21 / plan.target_duration_days) * 100))}
                      className="mt-3 h-3"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Objectifs hebdo
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                        {plan.weekly_objectives.map((objective) => (
                          <li key={objective}>• {objective}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Points de vigilance
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                        {plan.self_check_prompts.map((prompt) => (
                          <li key={prompt}>• {prompt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="questionnaires">
            <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="font-heading text-3xl">
                  Catalogue de questionnaires
                </CardTitle>
                <CardDescription>
                  Modeles cadence et validation clinique pour le suivi quotidien
                  et hebdomadaire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Questionnaire</TableHead>
                      <TableHead>Public</TableHead>
                      <TableHead>Cadence</TableHead>
                      <TableHead>Validation</TableHead>
                      <TableHead className="text-right">Questions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionnaires.map((questionnaire) => (
                      <TableRow key={questionnaire.slug}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{questionnaire.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {questionnaire.intro_text}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{questionnaire.audience}</TableCell>
                        <TableCell>{questionnaire.cadence}</TableCell>
                        <TableCell>{questionnaire.medically_validated_by}</TableCell>
                        <TableCell className="text-right">
                          {questionnaire.questions.length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercices">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">
                    Progression guidee
                  </CardTitle>
                  <CardDescription>
                    Chaque exercice embarque des consignes, du materiel et un
                    critere de validation clinique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.slug}
                      className="rounded-[1.35rem] border border-border/80 bg-secondary/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{exercise.title}</p>
                        <Badge variant="outline">{exercise.phase}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {exercise.duration_minutes} min · {exercise.difficulty}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">
                    Protocoles disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion multiple={false} className="w-full">
                    {exercises.map((exercise) => (
                      <AccordionItem key={exercise.slug} value={exercise.slug}>
                        <AccordionTrigger className="text-left">
                          <div>
                            <p className="font-medium">{exercise.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.summary}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="grid gap-5 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">
                              Consignes
                            </p>
                            <ul className="mt-2 space-y-2 leading-7">
                              {exercise.instructions.map((instruction) => (
                                <li key={instruction}>• {instruction}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="font-medium text-foreground">
                                Materiel
                              </p>
                              <ul className="mt-2 space-y-2 leading-7">
                                {exercise.equipment.map((item) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                Validation
                              </p>
                              <ul className="mt-2 space-y-2 leading-7">
                                {exercise.validation_criteria.map((criterion) => (
                                  <li key={criterion}>• {criterion}</li>
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
            </div>
          </TabsContent>

          <TabsContent id="alertes" value="alertes" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                      <ShieldAlert className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-3xl">
                        Regles d&apos;alerte
                      </CardTitle>
                      <CardDescription>
                        Signaux suivis pour l&apos;escalade clinique.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alertRules.map((rule) => (
                    <div
                      key={rule.code}
                      className="rounded-[1.35rem] border border-border/80 bg-card p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{rule.title}</p>
                        <Badge variant="outline">{rule.severity}</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                        {rule.trigger_conditions.map((condition) => (
                          <li key={condition}>• {condition}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <SymptomChecker />
            </div>
          </TabsContent>

          <TabsContent value="coordination">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">
                    Equipe de suivi
                  </CardTitle>
                  <CardDescription>
                    Contacts et disponibilites pour le parcours patient.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.email}
                      className="rounded-[1.35rem] border border-border/80 bg-secondary/35 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{contact.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.role} · {contact.specialty}
                          </p>
                        </div>
                        {contact.is_primary ? (
                          <Badge className="bg-primary text-primary-foreground">
                            Referent
                          </Badge>
                        ) : null}
                      </div>
                      <div className="mt-3 text-sm leading-7 text-muted-foreground">
                        <p>{contact.email}</p>
                        <p>{contact.phone}</p>
                        <p>{contact.availability}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-white/85 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">
                    Taches de coordination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={`${task.patient_code}-${task.title}`}
                      className="rounded-[1.35rem] border border-border/80 bg-card p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{task.patient_code}</Badge>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary">{task.status}</Badge>
                      </div>
                      <p className="mt-3 text-lg font-medium">{task.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {task.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Responsable: {task.responsible_role}</span>
                        <span>Canal: {task.channel}</span>
                        <span>Echeance: {new Date(task.due_at).toLocaleString("fr-FR")}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
