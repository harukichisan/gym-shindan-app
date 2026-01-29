// API types for gym-diagnosis app (MVP: share only)

import type {
  GymType,
  Mode,
  Question,
  ScoringRule,
  SafetyFlags,
} from './domain';

export type AnswerValue = string | number | string[];

export interface Answer {
  question_id: string;
  value: AnswerValue;
}

export interface ConfigResponse {
  version: string;
  questions: Question[];
  gym_types: GymType[];
  scoring_rules: ScoringRule[];
}

export interface DiagnosisScoreRequest {
  mode: Mode;
  answers: Answer[];
}

export interface First4WeeksPlan {
  frequency: string;
  duration: string;
  focus: string[];
}

export interface DiagnosisScoreResponse {
  result_top3: string[];
  reasons: Record<string, string[]>;
  safety_flags: SafetyFlags;
  bottlenecks: string[];
  first_4weeks: First4WeeksPlan;
}

export interface SharePayload {
  v: number; // schema version
  mode: Mode;
  result_top3: string[];
  reasons?: Record<string, string[]>;
  safety_flags: SafetyFlags;
}

export interface ShareCreateRequest {
  payload: SharePayload;
}

export interface ShareCreateResponse {
  share_id: string;
  expires_at?: string; // ISO 8601
}

export interface ShareGetResponse {
  payload: SharePayload;
}

export interface ErrorDetail {
  field?: string;
  reason: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}
