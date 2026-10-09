import { IGpaConverterService } from '../ports/IGpaConverterService';
import { VigesimalGradeInput, GpaConverterResult } from '../domain/types';
import { calculateGpaConverter, validateVigesimalGradeInput } from '../domain/math';

export class LocalGpaConverterAdapter implements IGpaConverterService {
  calculate(input: VigesimalGradeInput): GpaConverterResult {
    return calculateGpaConverter(input);
  }

  validate(input: VigesimalGradeInput): Record<string, string> | null {
    return validateVigesimalGradeInput(input);
  }
}

export const gpaConverterService: IGpaConverterService = new LocalGpaConverterAdapter();
