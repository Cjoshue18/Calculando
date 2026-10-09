import { IToolCalculationService } from '@/core/contracts/IToolCalculationService';
import { RentaQuintaInput, RentaQuintaResult } from '../domain/types';

export interface IRentaQuintaService extends IToolCalculationService<RentaQuintaInput, RentaQuintaResult> {}
