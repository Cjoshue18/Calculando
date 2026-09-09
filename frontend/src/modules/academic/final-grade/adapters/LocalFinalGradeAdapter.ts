import { IFinalGradeService } from '../ports/IFinalGradeService';
import { FinalGradeInput, FinalGradeResult } from '../domain/types';
import { calculateFinalGrade, validateFinalGradeInput } from '../domain/math';

/**
 * Phase 1 Adapter: In-Memory Client Execution
 * Runs 100% in user's browser with 0ms network latency.
 */
export class LocalFinalGradeAdapter implements IFinalGradeService {
  calculate(input: FinalGradeInput): FinalGradeResult {
    return calculateFinalGrade(input);
  }

  validate(input: FinalGradeInput): Record<string, string> | null {
    const errors = validateFinalGradeInput(input);
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

export const finalGradeService: IFinalGradeService = new LocalFinalGradeAdapter();
