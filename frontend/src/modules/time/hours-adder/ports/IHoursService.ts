import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { TimeCalculationInput, TimeCalculationResult } from '../domain/types';

export interface IHoursService extends IToolCalculationService<TimeCalculationInput, TimeCalculationResult> {
  calculate(input: TimeCalculationInput): TimeCalculationResult;
  validate(input: TimeCalculationInput): Record<string, string> | null;
}
