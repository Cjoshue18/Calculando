import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { GpaCalculationInput, GpaCalculationResult } from '../domain/types';

/**
 * Port contract for GPA Calculation Service (Hexagonal Architecture).
 * Defines client and server calculation contract.
 */
export interface IGpaService extends IToolCalculationService<GpaCalculationInput, GpaCalculationResult> {}
