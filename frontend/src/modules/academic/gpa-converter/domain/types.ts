export type ConversionStandard = 'wes_standard' | 'linear' | 'bavarian';

export interface VigesimalGradeInput {
  grade: number; // 0.00 to 20.00
  passingGrade?: number; // 10.5 or 11.0 (default 11.0)
  standard?: ConversionStandard;
}

export interface EquivalenceRow {
  vigesimalRange: string;
  minGrade: number;
  maxGrade: number;
  usGpa: number;
  letterGrade: string;
  ectsGrade: string;
  descriptionEs: string;
  descriptionEn: string;
  percentileRank: string;
}

export interface GpaConverterResult {
  vigesimalGrade: number;
  usGpa: number;
  usGpaFormatted: string; // e.g. "3.70 / 4.00"
  letterGrade: string;
  ectsGrade: string;
  ectsDescription: string;
  bavarianGrade: number; // German scale 1.0 - 5.0
  bavarianGradeFormatted: string;
  academicHonors: string;
  isPassing: boolean;
  matchingRowIndex: number;
  table: EquivalenceRow[];
  canonicalLatex: string;
  substitutionLatex: string;
}
