export interface CourseItem {
  id: string;
  name: string;
  grade: number | '';
  credits: number | '';
  [key: string]: unknown;
}

export type GpaStatus = 'approved' | 'at_risk' | 'failed' | 'empty';

export interface FormulaStep {
  label: string;
  value: string;
  detail?: string;
}

export interface CourseBreakdownItem {
  id: string;
  name: string;
  grade: number;
  credits: number;
  points: number;
  isPassing: boolean;
}

export interface GpaCalculationInput {
  courses: CourseItem[];
  maxScale?: number; // e.g., 20, 10, 4, 100
  passingGrade?: number; // e.g., 10.5 for 20, 5.0 for 10, 2.0 for 4
  semesterName?: string; // Optional label, e.g. "2026-I"
  [key: string]: unknown;
}

export interface GpaCalculationResult {
  weightedAverage: number;
  totalCredits: number;
  totalPoints: number;
  status: GpaStatus;
  statusMessage: string;
  formulaSteps: FormulaStep[];
  canonicalLatex: string;
  substitutionLatex: string;
  formulaString: string;
  coursesBreakdown: CourseBreakdownItem[];
  approvedCredits: number;
  failedCredits: number;
  isValid: boolean;
  errors: Record<string, string>;
  [key: string]: unknown;
}
