export type RecoveryPlan = {
  id: number;
  slug: string;
  title: string;
  specialty: string;
  surgery_type: string;
  target_duration_days: number;
  overview: string;
  weekly_objectives: string[];
  self_check_prompts: string[];
  care_team_roles: string[];
};

export type QuestionnaireTemplate = {
  id: number;
  slug: string;
  title: string;
  audience: string;
  cadence: string;
  intro_text: string;
  medically_validated_by: string;
  questions: Array<{ label: string; type: string; required: boolean }>;
};

export type ExerciseProtocol = {
  id: number;
  slug: string;
  title: string;
  phase: string;
  difficulty: string;
  duration_minutes: number;
  summary: string;
  equipment: string[];
  instructions: string[];
  validation_criteria: string[];
  media_url: string;
};

export type AlertRule = {
  id: number;
  code: string;
  title: string;
  severity: string;
  trigger_conditions: string[];
  immediate_action: string;
};

export type CareTeamContact = {
  id: number;
  full_name: string;
  role: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  is_primary: boolean;
};

export type CareCoordinationTask = {
  id: number;
  patient_code: string;
  title: string;
  responsible_role: string;
  status: string;
  priority: string;
  due_at: string;
  summary: string;
  channel: string;
};

type Snapshot<T> = {
  data: T;
  online: boolean;
};

export type DashboardData = {
  plans: RecoveryPlan[];
  questionnaires: QuestionnaireTemplate[];
  exercises: ExerciseProtocol[];
  alertRules: AlertRule[];
  contacts: CareTeamContact[];
  tasks: CareCoordinationTask[];
  services: Array<{ name: string; online: boolean; description: string }>;
};

const serviceUrls = {
  recovery: process.env.RECOVERY_PLAN_SERVICE_URL ?? "http://localhost:8001",
  questionnaire:
    process.env.QUESTIONNAIRE_SERVICE_URL ?? "http://localhost:8002",
  exercise:
    process.env.EXERCISE_GUIDANCE_SERVICE_URL ?? "http://localhost:8003",
  complication:
    process.env.COMPLICATION_ALERT_SERVICE_URL ?? "http://localhost:8004",
  coordination:
    process.env.CARE_COORDINATION_SERVICE_URL ?? "http://localhost:8005",
} as const;

async function fetchSnapshot<T>(url: string, fallback: T): Promise<Snapshot<T>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }

    return {
      data: (await response.json()) as T,
      online: true,
    };
  } catch {
    return {
      data: fallback,
      online: false,
    };
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const [plans, questionnaires, exercises, alertRules, contacts, tasks] =
    await Promise.all([
      fetchSnapshot<RecoveryPlan[]>(
        `${serviceUrls.recovery}/api/recovery-plans/`,
        [],
      ),
      fetchSnapshot<QuestionnaireTemplate[]>(
        `${serviceUrls.questionnaire}/api/questionnaires/`,
        [],
      ),
      fetchSnapshot<ExerciseProtocol[]>(
        `${serviceUrls.exercise}/api/exercises/`,
        [],
      ),
      fetchSnapshot<AlertRule[]>(
        `${serviceUrls.complication}/api/alert-rules/`,
        [],
      ),
      fetchSnapshot<CareTeamContact[]>(
        `${serviceUrls.coordination}/api/care-team/`,
        [],
      ),
      fetchSnapshot<CareCoordinationTask[]>(
        `${serviceUrls.coordination}/api/care-tasks/`,
        [],
      ),
    ]);

  return {
    plans: plans.data,
    questionnaires: questionnaires.data,
    exercises: exercises.data,
    alertRules: alertRules.data,
    contacts: contacts.data,
    tasks: tasks.data,
    services: [
      {
        name: "Parcours",
        online: plans.online,
        description: "Bibliotheque de parcours post-op types",
      },
      {
        name: "Questionnaires",
        online: questionnaires.online,
        description: "Suivi clinique cadence et reponses patient",
      },
      {
        name: "Exercices",
        online: exercises.online,
        description: "Protocoles guides avec validation terrain",
      },
      {
        name: "Alertes",
        online: alertRules.online,
        description: "Evaluation automatique des signaux de complication",
      },
      {
        name: "Coordination",
        online: contacts.online && tasks.online,
        description: "Synchronisation entre medecins kine et infirmiers",
      },
    ],
  };
}

export function getComplicationServiceUrl(): string {
  return serviceUrls.complication;
}
