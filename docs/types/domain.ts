// Domain types for gym-diagnosis app (MVP: share only)

export type Mode = 'simple' | 'complex';

export type QuestionType = 'single' | 'multi' | 'slider' | 'text';

export interface QuestionOption {
  value: string;
  label: string;
  example?: string;
}

export interface BranchingRule {
  if: { question_id: string; operator: 'eq' | 'neq' | 'in' | 'not_in'; value: string | string[] };
  then: { action: 'skip_to' | 'end'; target?: string };
}

export interface Question {
  id: string;
  mode: Mode;
  section?: string;
  type: QuestionType;
  prompt: string;
  options?: QuestionOption[];
  example_hint?: string;
  branching_rules?: BranchingRule[];
}

export interface GymType {
  id: string;
  name: string;
  description?: string;
  price_range?: string; // e.g. "6000-12000"
  fit_reasons?: string[];
  cautions?: string[];
  pain_considerations?: string[];
  checklist_items?: string[];
  tags?: string[];
}

export interface ScoringRule {
  gym_type_id: string;
  trait_id: string;
  weight: number; // -3..+3
  reason_template?: string;
}

export interface SafetyFlags {
  pain_present: boolean;
  red_flag_maybe: boolean;
}
