// ─── Types ────────────────────────────────────────────────────────────────────

export type RecoveryPlan = {
  id: number;
  slug: string;
  patient_code: string;
  title: string;
  specialty: string;
  surgery_type: string;
  target_duration_days: number;
  start_date: string | null;
  overview: string;
  weekly_objectives: string[];
  self_check_prompts: string[];
  care_team_roles: string[];
  created_at: string;
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

export type AlertAssessment = {
  id: number;
  patient_code: string;
  pain_level: number;
  has_fever: boolean;
  bleeding_level: "none" | "light" | "moderate" | "severe";
  swelling_level: number;
  notes: string;
  computed_severity: "low" | "medium" | "high" | "critical";
  triggered_rules: Array<{ code: string; title: string; severity: string; immediate_action: string }>;
  care_recommendation: string;
  created_at: string;
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

export type PatientCareAssignment = {
  id: number;
  patient_code: string;
  contact: CareTeamContact;
  role_on_case: string;
  notes: string;
  assigned_at: string;
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
  plans: (patientCode?: string) => {
    const url = patientCode
      ? `${serviceUrls.recovery}/api/recovery-plans/?patient_code=${encodeURIComponent(patientCode)}`
      : `${serviceUrls.recovery}/api/recovery-plans/`;
    return safeGet<RecoveryPlan[]>(url, []);
  },
  plan: (slug: string) =>
    safeGet<RecoveryPlan | null>(
      `${serviceUrls.recovery}/api/recovery-plans/${slug}/`,
      null,
    ),
};

export const getRecoveryServiceUrl = () => serviceUrls.recovery;

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
  assessments: (patientCode?: string) => {
    const url = patientCode
      ? `${serviceUrls.complication}/api/alerts/?patient_code=${encodeURIComponent(patientCode)}`
      : `${serviceUrls.complication}/api/alerts/`;
    return safeGet<AlertAssessment[]>(url, []);
  },
};

// ─── Care Coordination Service (port 8005) ───────────────────────────────────

export const coordinationApi = {
  team: () =>
    safeGet<CareTeamContact[]>(`${serviceUrls.coordination}/api/care-team/`, []),
  assignments: (patientCode?: string) => {
    const url = patientCode
      ? `${serviceUrls.coordination}/api/care-assignments/?patient_code=${encodeURIComponent(patientCode)}`
      : `${serviceUrls.coordination}/api/care-assignments/`;
    return safeGet<PatientCareAssignment[]>(url, []);
  },
  tasks: (patientCode?: string) => {
    const url = patientCode
      ? `${serviceUrls.coordination}/api/care-tasks/?patient_code=${encodeURIComponent(patientCode)}`
      : `${serviceUrls.coordination}/api/care-tasks/`;
    return safeGet<CareCoordinationTask[]>(url, []);
  },
};

// ─── URL getters for server-side API proxy routes ────────────────────────────

export const getComplicationServiceUrl = () => serviceUrls.complication;
export const getQuestionnaireServiceUrl = () => serviceUrls.questionnaire;
export const getCoordinationServiceUrl = () => serviceUrls.coordination;
export const getExerciseServiceUrl = () => serviceUrls.exercise;
