import { IGpaService } from '../ports/IGpaService';
import { GpaCalculationInput, GpaCalculationResult } from '../domain/types';
import { calculateGpa, validateGpaInput } from '../domain/math';

/**
 * Phase 1 Local Adapter: In-Memory Client Execution
 * Runs 100% in user's browser with 0ms network latency and strict client privacy.
 */
export class LocalGpaAdapter implements IGpaService {
  calculate(input: GpaCalculationInput): GpaCalculationResult {
    return calculateGpa(input);
  }

  validate(input: GpaCalculationInput): Record<string, string> | null {
    const errors = validateGpaInput(input);
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

export const gpaService: IGpaService = new LocalGpaAdapter();
