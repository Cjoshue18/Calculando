import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { IgvInput, IgvResult } from '../domain/types';

export interface IIgvService extends IToolCalculationService<IgvInput, IgvResult> {}
