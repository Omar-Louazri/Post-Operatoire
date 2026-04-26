export type RoleColor = "teal" | "rose" | "indigo" | "amber";

export type Step = {
  id: string;
  label: string;
  description: string;
  service: string;
  href: string;
};

export type RoleConfig = {
  id: string;
  name: string;
  subtitle: string;
  color: RoleColor;
  href: string;
  capabilities: string[];
  steps: Step[];
};

export const ROLES: RoleConfig[] = [
  {
    id: "patient",
    name: "Patient",
    subtitle: "Suivez votre récupération étape par étape.",
    color: "teal",
    href: "/patient/parcours",
    capabilities: [
      "Consulter votre parcours post-op",
      "Remplir votre questionnaire quotidien",
      "Suivre vos exercices guidés",
      "Signaler des complications",
    ],
    steps: [
      {
        id: "parcours",
        label: "Parcours de soins",
        description: "Votre programme de récupération",
        service: "recovery-plan-service",
        href: "/patient/parcours",
      },
      {
        id: "questionnaire",
        label: "Questionnaire",
        description: "Suivi quotidien douleur & fatigue",
        service: "questionnaire-service",
        href: "/patient/questionnaire",
      },
      {
        id: "exercices",
        label: "Exercices guidés",
        description: "Rééducation à domicile",
        service: "exercise-guidance-service",
        href: "/patient/exercices",
      },
      {
        id: "alertes",
        label: "Triage d'urgence",
        description: "Signaler une complication",
        service: "complication-alert-service",
        href: "/patient/alertes",
      },
    ],
  },
  {
    id: "chirurgien",
    name: "Chirurgien / Médecin",
    subtitle: "Supervisez les parcours et gérez les alertes cliniques.",
    color: "rose",
    href: "/chirurgien/parcours",
    capabilities: [
      "Consulter les plans de récupération",
      "Analyser les réponses des patients",
      "Gérer les règles d'alerte",
    ],
    steps: [
      {
        id: "parcours",
        label: "Plans de récupération",
        description: "Bibliothèque des parcours post-op",
        service: "recovery-plan-service",
        href: "/chirurgien/parcours",
      },
      {
        id: "questionnaires",
        label: "Réponses patients",
        description: "Questionnaires soumis & scores douleur",
        service: "questionnaire-service",
        href: "/chirurgien/questionnaires",
      },
      {
        id: "alertes",
        label: "Règles d'alerte",
        description: "Signaux de complication & triage",
        service: "complication-alert-service",
        href: "/chirurgien/alertes",
      },
    ],
  },
  {
    id: "kinesitherapeute",
    name: "Kinésithérapeute",
    subtitle: "Guidez la rééducation et suivez la progression.",
    color: "indigo",
    href: "/kinesitherapeute/exercices",
    capabilities: [
      "Consulter les protocoles d'exercices",
      "Suivre les réponses mobilité des patients",
    ],
    steps: [
      {
        id: "exercices",
        label: "Protocoles exercices",
        description: "Séquences de rééducation guidées",
        service: "exercise-guidance-service",
        href: "/kinesitherapeute/exercices",
      },
      {
        id: "patients",
        label: "Suivi patients",
        description: "Questionnaires autonomie & mobilité",
        service: "questionnaire-service",
        href: "/kinesitherapeute/patients",
      },
    ],
  },
  {
    id: "coordinateur",
    name: "Coordinateur de parcours",
    subtitle: "Coordonnez l'équipe et planifiez les tâches de suivi.",
    color: "amber",
    href: "/coordinateur/equipe",
    capabilities: [
      "Gérer l'équipe soignante",
      "Planifier les tâches de coordination",
    ],
    steps: [
      {
        id: "equipe",
        label: "Équipe soignante",
        description: "Contacts, rôles et disponibilités",
        service: "care-coordination-service",
        href: "/coordinateur/equipe",
      },
      {
        id: "taches",
        label: "Tâches de suivi",
        description: "Planification et priorisation",
        service: "care-coordination-service",
        href: "/coordinateur/taches",
      },
    ],
  },
];

export const ROLE_COLORS: Record<
  RoleColor,
  {
    text: string;
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    activeDot: string;
    badge: string;
    btn: string;
    cardHover: string;
    light: string;
  }
> = {
  teal: {
    text: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    iconBg: "bg-teal-100",
    iconText: "text-teal-700",
    activeDot: "bg-teal-600",
    badge: "bg-teal-100 text-teal-800 border-teal-200",
    btn: "bg-teal-600 hover:bg-teal-700 text-white",
    cardHover: "hover:border-teal-300 hover:shadow-teal-100",
    light: "bg-teal-600/10",
  },
  rose: {
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconText: "text-rose-700",
    activeDot: "bg-rose-600",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    btn: "bg-rose-600 hover:bg-rose-700 text-white",
    cardHover: "hover:border-rose-300 hover:shadow-rose-100",
    light: "bg-rose-600/10",
  },
  indigo: {
    text: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-700",
    activeDot: "bg-indigo-600",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
    cardHover: "hover:border-indigo-300 hover:shadow-indigo-100",
    light: "bg-indigo-600/10",
  },
  amber: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    activeDot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
    cardHover: "hover:border-amber-300 hover:shadow-amber-100",
    light: "bg-amber-500/10",
  },
};
