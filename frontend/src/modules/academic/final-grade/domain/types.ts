export interface Evaluation {
  id: string;
  name: string;
  score: number | '';
  weight: number | '';
  [key: string]: unknown;
}

export interface FinalGradeInput {
  evaluations: Evaluation[];
  finalExamWeight: number | '';
  passingThreshold: number; // e.g., 10.5, 11, 5, 3.0, 60...
  maxScale?: number; // e.g., 20, 10, 5, 100, or custom country scale
  [key: string]: unknown;
}

export type FinalGradeStatus = 'approved' | 'feasible' | 'challenging' | 'impossible';

export interface FinalGradeResult {
  accumulatedPoints: number;
  accumulatedWeight: number;
  finalExamWeight: number;
  totalAllocatedWeight: number;
  requiredFinalScore: number;
  status: FinalGradeStatus;
  statusMessage: string;
  formulaString: string;
  canonicalLatex: string;
  substitutionLatex: string;
  formulaSteps: { label: string; value: string }[];
  isValid: boolean;
  errors: Record<string, string>;
}
