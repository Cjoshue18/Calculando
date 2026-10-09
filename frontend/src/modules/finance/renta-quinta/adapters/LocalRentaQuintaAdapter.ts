import { IRentaQuintaService } from '../ports/IRentaQuintaService';
import { RentaQuintaInput, RentaQuintaResult } from '../domain/types';
import { calculateRentaQuinta, validateRentaQuintaInput } from '../domain/math';

export class LocalRentaQuintaAdapter implements IRentaQuintaService {
  calculate(input: RentaQuintaInput): RentaQuintaResult {
    return calculateRentaQuinta(input);
  }

  validate(input: RentaQuintaInput): Record<string, string> | null {
    return validateRentaQuintaInput(input);
  }
}

export const rentaQuintaService: IRentaQuintaService = new LocalRentaQuintaAdapter();
