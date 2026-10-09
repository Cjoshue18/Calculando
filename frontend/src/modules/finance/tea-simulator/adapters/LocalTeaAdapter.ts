import { ITeaService } from '../ports/ITeaService';
import { TeaInput, TeaResult } from '../domain/types';
import { calculateTeaSimulation, validateTeaInput } from '../domain/math';

export class LocalTeaAdapter implements ITeaService {
  calculate(input: TeaInput): TeaResult {
    return calculateTeaSimulation(input);
  }

  validate(input: TeaInput): Record<string, string> | null {
    return validateTeaInput(input);
  }
}

export const teaService: ITeaService = new LocalTeaAdapter();
