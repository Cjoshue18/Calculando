import { IHoursService } from '../ports/IHoursService';
import { TimeCalculationInput, TimeCalculationResult } from '../domain/types';
import { calculateHours, validateHoursInput } from '../domain/math';

/**
 * Phase 1 Adapter: In-Memory Client Execution
 * Runs 100% in user's browser with 0ms network latency.
 */
export class LocalHoursAdapter implements IHoursService {
  calculate(input: TimeCalculationInput): TimeCalculationResult {
    return calculateHours(input);
  }

  validate(input: TimeCalculationInput): Record<string, string> | null {
    return validateHoursInput(input);
  }
}

export const hoursService: IHoursService = new LocalHoursAdapter();
