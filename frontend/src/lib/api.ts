// ─── Types ────────────────────────────────────────────────────────────────────

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

export type QuestionnaireSubmission = {
  id: number;
  patient_code: string;
  template: QuestionnaireTemplate;
  scheduled_for: string | null;
  submitted_at: string;
  status: "pending" | "submitted" | "escalated";
  answers: Record<string, unknown>;
  pain_score: number | null;
  free_text: string;
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
  severity: "low" | "medium" | "high" | "critical";
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
  status: "planned" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_at: string;
  summary: string;
  channel: string;
};

// ─── Service URLs ─────────────────────────────────────────────────────────────

const serviceUrls = {
  recovery: process.env.RECOVERY_PLAN_SERVICE_URL ?? "http://localhost:8001",
  questionnaire: process.env.QUESTIONNAIRE_SERVICE_URL ?? "http://localhost:8002",
  exercise: process.env.EXERCISE_GUIDANCE_SERVICE_URL ?? "http://localhost:8003",
  complication: process.env.COMPLICATION_ALERT_SERVICE_URL ?? "http://localhost:8004",
  coordination: process.env.CARE_COORDINATION_SERVICE_URL ?? "http://localhost:8005",
} as const;

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ─── Recovery Plan Service (port 8001) ───────────────────────────────────────

export const recoveryApi = {
  plans: () =>
    safeGet<RecoveryPlan[]>(`${serviceUrls.recovery}/api/recovery-plans/`, []),
  plan: (slug: string) =>
    safeGet<RecoveryPlan | null>(
      `${serviceUrls.recovery}/api/recovery-plans/${slug}/`,
      null,
    ),
};

// ─── Questionnaire Service (port 8002) ───────────────────────────────────────

export const questionnaireApi = {
  templates: () =>
    safeGet<QuestionnaireTemplate[]>(
      `${serviceUrls.questionnaire}/api/questionnaires/`,
      [],
    ),
  submissions: () =>
    safeGet<QuestionnaireSubmission[]>(
      `${serviceUrls.questionnaire}/api/submissions/`,
      [],
    ),
};

// ─── Exercise Guidance Service (port 8003) ───────────────────────────────────

export const exerciseApi = {
  protocols: () =>
    safeGet<ExerciseProtocol[]>(`${serviceUrls.exercise}/api/exercises/`, []),
  protocol: (slug: string) =>
    safeGet<ExerciseProtocol | null>(
      `${serviceUrls.exercise}/api/exercises/${slug}/`,
      null,
    ),
};

// ─── Complication Alert Service (port 8004) ──────────────────────────────────

export const alertApi = {
  rules: () =>
    safeGet<AlertRule[]>(`${serviceUrls.complication}/api/alert-rules/`, []),
};

// ─── Care Coordination Service (port 8005) ───────────────────────────────────

export const coordinationApi = {
  team: () =>
    safeGet<CareTeamContact[]>(`${serviceUrls.coordination}/api/care-team/`, []),
  tasks: () =>
    safeGet<CareCoordinationTask[]>(
      `${serviceUrls.coordination}/api/care-tasks/`,
      [],
    ),
};

// ─── URL getters for server-side API proxy routes ────────────────────────────

export const getComplicationServiceUrl = () => serviceUrls.complication;
export const getQuestionnaireServiceUrl = () => serviceUrls.questionnaire;
