import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { VigesimalGradeInput, GpaConverterResult } from '../domain/types';

export interface IGpaConverterService extends IToolCalculationService<VigesimalGradeInput, GpaConverterResult> {}
