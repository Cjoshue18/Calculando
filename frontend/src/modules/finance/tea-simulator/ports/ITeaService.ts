import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { TeaInput, TeaResult } from '../domain/types';

export interface ITeaService extends IToolCalculationService<TeaInput, TeaResult> {}
