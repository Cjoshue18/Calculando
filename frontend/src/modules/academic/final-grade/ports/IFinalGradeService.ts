import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { FinalGradeInput, FinalGradeResult } from '../domain/types';

export interface IFinalGradeService extends IToolCalculationService<FinalGradeInput, FinalGradeResult> {}
