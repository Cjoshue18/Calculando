import { VigesimalGradeInput, GpaConverterResult, EquivalenceRow } from './types';

export const EQUIVALENCE_TABLE: EquivalenceRow[] = [
  {
    vigesimalRange: '19.00 - 20.00',
    minGrade: 19.0,
    maxGrade: 20.0,
    usGpa: 4.0,
    letterGrade: 'A+',
    ectsGrade: 'A',
    descriptionEs: 'Excelente / Summa Cum Laude',
    descriptionEn: 'Excellent / Summa Cum Laude',
    percentileRank: 'Décimo Superior (Top 5%)',
  },
  {
    vigesimalRange: '18.00 - 18.99',
    minGrade: 18.0,
    maxGrade: 18.999,
    usGpa: 4.0,
    letterGrade: 'A',
    ectsGrade: 'A',
    descriptionEs: 'Sobresaliente / Magna Cum Laude',
    descriptionEn: 'Outstanding / Magna Cum Laude',
    percentileRank: 'Décimo Superior (Top 10%)',
  },
  {
    vigesimalRange: '16.50 - 17.99',
    minGrade: 16.5,
    maxGrade: 17.999,
    usGpa: 3.7,
    letterGrade: 'A-',
    ectsGrade: 'B',
    descriptionEs: 'Muy Bueno / Cum Laude',
    descriptionEn: 'Very Good / Cum Laude',
    percentileRank: 'Quinto Superior (Top 20%)',
  },
  {
    vigesimalRange: '15.00 - 16.49',
    minGrade: 15.0,
    maxGrade: 16.499,
    usGpa: 3.33,
    letterGrade: 'B+',
    ectsGrade: 'B',
    descriptionEs: 'Notable / Distinguido',
    descriptionEn: 'Good / High Merit',
    percentileRank: 'Tercio Superior (Top 30%)',
  },
  {
    vigesimalRange: '14.00 - 14.99',
    minGrade: 14.0,
    maxGrade: 14.999,
    usGpa: 3.0,
    letterGrade: 'B',
    ectsGrade: 'C',
    descriptionEs: 'Bueno / Competente',
    descriptionEn: 'Average / Competent',
    percentileRank: 'Medio Superior (Top 50%)',
  },
  {
    vigesimalRange: '13.00 - 13.99',
    minGrade: 13.0,
    maxGrade: 13.999,
    usGpa: 2.7,
    letterGrade: 'B-',
    ectsGrade: 'C',
    descriptionEs: 'Satisfactorio',
    descriptionEn: 'Satisfactory',
    percentileRank: 'Aprobado regular',
  },
  {
    vigesimalRange: '12.00 - 12.99',
    minGrade: 12.0,
    maxGrade: 12.999,
    usGpa: 2.3,
    letterGrade: 'C+',
    ectsGrade: 'D',
    descriptionEs: 'Aceptable',
    descriptionEn: 'Passable',
    percentileRank: 'Aprobado básico',
  },
  {
    vigesimalRange: '11.00 - 11.99',
    minGrade: 11.0,
    maxGrade: 11.999,
    usGpa: 2.0,
    letterGrade: 'C',
    ectsGrade: 'E',
    descriptionEs: 'Aprobado mínimo',
    descriptionEn: 'Minimum Passing',
    percentileRank: 'Límite aprobatorio',
  },
  {
    vigesimalRange: '0.00 - 10.99',
    minGrade: 0.0,
    maxGrade: 10.999,
    usGpa: 0.0,
    letterGrade: 'F',
    ectsGrade: 'F',
    descriptionEs: 'Desaprobado / Insuficiente',
    descriptionEn: 'Failed / Insufficient',
    percentileRank: 'Reprobado',
  },
];

export function calculateGpaConverter(input: VigesimalGradeInput): GpaConverterResult {
  const grade = Math.min(20, Math.max(0, input.grade || 0));
  const passingGrade = input.passingGrade ?? 11.0;
  const isPassing = grade >= passingGrade;

  // Match row in table
  let matchingRowIndex = EQUIVALENCE_TABLE.findIndex(
    (row) => grade >= row.minGrade && grade <= row.maxGrade
  );

  // Corner boundary case for grade == 20
  if (matchingRowIndex === -1) {
    matchingRowIndex = grade >= 19.0 ? 0 : EQUIVALENCE_TABLE.length - 1;
  }

  const matchedRow = EQUIVALENCE_TABLE[matchingRowIndex];

  // Calculate Bavarian German Grade:
  // Formula: N_ger = 1 + 3 * (N_max - N) / (N_max - N_min)
  let bavarianGrade = 5.0;
  if (grade >= passingGrade) {
    const rawBavarian = 1 + 3 * ((20.0 - grade) / (20.0 - passingGrade));
    bavarianGrade = Math.round(Math.min(4.0, Math.max(1.0, rawBavarian)) * 100) / 100;
  }

  const bavarianDescription = 
    bavarianGrade <= 1.5 ? 'Sehr gut (Sobresaliente)' :
    bavarianGrade <= 2.5 ? 'Gut (Bueno)' :
    bavarianGrade <= 3.5 ? 'Befriedigend (Satisfactorio)' :
    bavarianGrade <= 4.0 ? 'Ausreichend (Suficiente)' : 'Nicht ausreichend (Desaprobado)';

  const usGpa = matchedRow.usGpa;
  const usGpaFormatted = `${usGpa.toFixed(2)} / 4.00`;
  const bavarianGradeFormatted = `${bavarianGrade.toFixed(2)} (${bavarianDescription})`;

  // LaTeX Canonical
  const canonicalLatex = '\\text{GPA}_{US} = f_{\\text{WES}}(N_{20}), \\qquad N_{\\text{Bavaria}} = 1 + 3 \\cdot \\left(\\frac{N_{\\max} - N}{N_{\\max} - N_{\\min}}\\right)';

  // LaTeX Substitution
  const substitutionLatex = isPassing
    ? `N_{20} = ${grade.toFixed(2)} \\implies \\mathbf{\\text{GPA}_{US} = ${usGpa.toFixed(2)}}, \\quad N_{\\text{Alemania}} = 1 + 3 \\cdot \\left(\\frac{20 - ${grade.toFixed(2)}}{20 - ${passingGrade.toFixed(1)}}\\right) = \\mathbf{${bavarianGrade.toFixed(2)}}`
    : `N_{20} = ${grade.toFixed(2)} < ${passingGrade.toFixed(1)} \\implies \\mathbf{\\text{GPA}_{US} = 0.00 \\; (\\text{F})}, \\quad N_{\\text{Alemania}} = \\mathbf{5.00 \\; (\\text{Fail})}`;

  return {
    vigesimalGrade: grade,
    usGpa,
    usGpaFormatted,
    letterGrade: matchedRow.letterGrade,
    ectsGrade: matchedRow.ectsGrade,
    ectsDescription: matchedRow.descriptionEs,
    bavarianGrade,
    bavarianGradeFormatted,
    academicHonors: matchedRow.percentileRank,
    isPassing,
    matchingRowIndex,
    table: EQUIVALENCE_TABLE,
    canonicalLatex,
    substitutionLatex,
  };
}

export function validateVigesimalGradeInput(input: VigesimalGradeInput): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (input.grade < 0 || input.grade > 20) {
    errors.grade = 'La nota vigesimal debe encontrarse en el rango de 0.00 a 20.00.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
