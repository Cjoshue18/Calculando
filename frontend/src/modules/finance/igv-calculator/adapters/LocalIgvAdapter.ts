import { IIgvService } from '../ports/IIgvService';
import { IgvInput, IgvResult } from '../domain/types';
import { calculateIgv, validateIgvInput } from '../domain/math';

export class LocalIgvAdapter implements IIgvService {
  calculate(input: IgvInput): IgvResult {
    return calculateIgv(input);
  }

  validate(input: IgvInput): Record<string, string> | null {
    return validateIgvInput(input);
  }
}

export const igvService: IIgvService = new LocalIgvAdapter();
