import {
  GpaCalculationInput,
  GpaCalculationResult,
  GpaStatus,
  CourseBreakdownItem,
  FormulaStep,
} from './types';

/**
 * Pure Mathematical Domain Service for Credit-Weighted GPA Calculation (Promedio Ponderado por Créditos).
 * 100% pure TypeScript: zero React, zero DOM, zero external dependencies.
 */

/**
 * Helper to round numbers to N decimal places with standard arithmetic rounding (half-up).
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Resolves the default passing threshold based on the maximum grading scale.
 */
export function getDefaultPassingGrade(maxScale: number): number {
  if (maxScale <= 4) return 2.0; // Standard US 4.0 GPA scale (2.0 = C, minimum satisfactory)
  if (maxScale <= 5) return 3.0; // Colombia 5.0 scale
  if (maxScale <= 10) return 5.0; // Mexico/Spain 10.0 scale
  if (maxScale <= 20) return 10.5; // Peru 0-20 vigesimal scale
  if (maxScale <= 100) return 60.0; // 0-100 percentage scale
  return roundToDecimals(maxScale * 0.525, 2);
}

/**
 * Validates course inputs and scale boundaries.
 */
export function validateGpaInput(input: GpaCalculationInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const maxScale = input.maxScale && input.maxScale > 0 ? input.maxScale : 20;

  if (input.maxScale !== undefined && (input.maxScale <= 0 || input.maxScale > 1000)) {
    errors.maxScale = 'La escala máxima debe ser un valor numérico entre 1 y 1000.';
  }

  const passingGrade = input.passingGrade ?? getDefaultPassingGrade(maxScale);
  if (passingGrade < 0 || passingGrade > maxScale) {
    errors.passingGrade = `La nota mínima aprobatoria debe estar entre 0 y ${maxScale}.`;
  }

  if (!input.courses || input.courses.length === 0) {
    errors.courses = 'Debes ingresar al menos un curso para calcular el promedio.';
    return errors;
  }

  input.courses.forEach((course, index) => {
    const courseLabel = course.name ? `"${course.name}"` : `Curso ${index + 1}`;

    if (course.grade !== '') {
      const gradeNum = Number(course.grade);
      if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > maxScale) {
        errors[`course_grade_${index}`] = `La nota de ${courseLabel} debe estar entre 0 y ${maxScale}.`;
      }
    }

    if (course.credits !== '') {
      const creditsNum = Number(course.credits);
      if (isNaN(creditsNum) || creditsNum <= 0 || !Number.isInteger(creditsNum) && creditsNum < 0.5) {
        errors[`course_credits_${index}`] = `Los créditos de ${courseLabel} deben ser mayores a 0.`;
      }
    }
  });

  return errors;
}

/**
 * Generates canonical and substituted LaTeX formulas alongside human-readable formula text.
 */
export function formatGpaFormula(
  input: GpaCalculationInput,
  result: Partial<GpaCalculationResult>
): { canonicalLatex: string; substitutionLatex: string; formulaString: string } {
  const maxScale = input.maxScale && input.maxScale > 0 ? input.maxScale : 20;
  const canonicalLatex =
    '\\text{PPA} = \\frac{\\sum_{i=1}^{n} (N_i \\cdot C_i)}{\\sum_{i=1}^{n} C_i}';

  const validCourses = (input.courses || []).filter(
    (c) => typeof c.grade === 'number' && typeof c.credits === 'number' && c.credits > 0
  );

  const totalPoints = result.totalPoints ?? 0;
  const totalCredits = result.totalCredits ?? 0;
  const weightedAverage = result.weightedAverage ?? 0;

  if (validCourses.length === 0 || totalCredits === 0) {
    return {
      canonicalLatex,
      substitutionLatex: '\\text{PPA} = \\frac{0}{0} = \\mathbf{0.00}',
      formulaString: 'Promedio Ponderado = 0 / 0 = 0.00',
    };
  }

  // Format numerator and denominator for substitution
  let numeratorLatex: string;
  let denominatorLatex: string;

  if (validCourses.length <= 4) {
    numeratorLatex = validCourses
      .map((c) => `(${c.grade} \\cdot ${c.credits})`)
      .join(' + ');
    denominatorLatex = validCourses.map((c) => `${c.credits}`).join(' + ');
  } else {
    // Abbreviated for length to avoid LaTeX overflow
    const firstTwo = validCourses
      .slice(0, 2)
      .map((c) => `(${c.grade} \\cdot ${c.credits})`)
      .join(' + ');
    const lastOne = validCourses
      .slice(-1)
      .map((c) => `(${c.grade} \\cdot ${c.credits})`)[0];
    numeratorLatex = `${firstTwo} + \\dots + ${lastOne}`;
    denominatorLatex = `${totalCredits}`;
  }

  const substitutionLatex = `\\text{PPA} = \\frac{${numeratorLatex}}{${denominatorLatex}} = \\frac{${totalPoints.toFixed(
    2
  )}}{${totalCredits}} = \\mathbf{${weightedAverage.toFixed(2)}} \\text{ / ${maxScale}}`;

  const formulaString = `Promedio Ponderado = (${totalPoints.toFixed(2)} pts) / (${totalCredits} cr.) = ${weightedAverage.toFixed(2)}`;

  return {
    canonicalLatex,
    substitutionLatex,
    formulaString,
  };
}

/**
 * Calculates credit-weighted GPA, total credits, total points, academic status, and step breakdown.
 */
export function calculateGpa(input: GpaCalculationInput): GpaCalculationResult {
  const maxScale = input.maxScale && input.maxScale > 0 ? input.maxScale : 20;
  const passingGrade = input.passingGrade ?? getDefaultPassingGrade(maxScale);
  const errors = validateGpaInput(input);
  const isValid = Object.keys(errors).length === 0;

  let totalPoints = 0;
  let totalCredits = 0;
  let approvedCredits = 0;
  let failedCredits = 0;

  const coursesBreakdown: CourseBreakdownItem[] = [];

  (input.courses || []).forEach((course, index) => {
    const hasGrade = typeof course.grade === 'number' && !isNaN(course.grade);
    const hasCredits = typeof course.credits === 'number' && !isNaN(course.credits) && course.credits > 0;

    if (hasGrade && hasCredits) {
      const grade = Math.min(Math.max(0, course.grade as number), maxScale);
      const credits = course.credits as number;
      const points = roundToDecimals(grade * credits, 2);

      totalPoints += points;
      totalCredits += credits;

      const isPassing = grade >= passingGrade;
      if (isPassing) {
        approvedCredits += credits;
      } else {
        failedCredits += credits;
      }

      coursesBreakdown.push({
        id: course.id || String(index + 1),
        name: (course.name && course.name.trim().length > 0) ? course.name.trim() : `Curso ${index + 1}`,
        grade,
        credits,
        points,
        isPassing,
      });
    }
  });

  // Edge case: No valid credits accumulated or empty list
  if (totalCredits === 0) {
    const { canonicalLatex, substitutionLatex, formulaString } = formatGpaFormula(input, {
      weightedAverage: 0,
      totalCredits: 0,
      totalPoints: 0,
    });

    return {
      weightedAverage: 0,
      totalCredits: 0,
      totalPoints: 0,
      status: 'empty',
      statusMessage: 'Ingresa las notas y créditos de tus asignaturas para calcular tu promedio ponderado.',
      formulaSteps: [],
      canonicalLatex,
      substitutionLatex,
      formulaString,
      coursesBreakdown: [],
      approvedCredits: 0,
      failedCredits: 0,
      isValid,
      errors,
    };
  }

  const rawAverage = totalPoints / totalCredits;
  const weightedAverage = roundToDecimals(rawAverage, 2);
  const roundedTotalPoints = roundToDecimals(totalPoints, 2);
  const roundedTotalCredits = roundToDecimals(totalCredits, 2);

  // Determine Academic Status
  // Risk margin: within ~7.5% of max scale above passing threshold
  const riskMargin =
    maxScale === 20
      ? 12.0
      : maxScale === 10
      ? 6.0
      : maxScale === 4
      ? 2.5
      : roundToDecimals(passingGrade + maxScale * 0.075, 2);

  let status: GpaStatus;
  let statusMessage: string;

  if (weightedAverage >= passingGrade) {
    if (weightedAverage < riskMargin) {
      status = 'at_risk';
      statusMessage =
        'Rendimiento en observación / riesgo académico. Tu promedio supera la nota mínima pero se encuentra próximo al umbral reglamentario.';
    } else {
      status = 'approved';
      statusMessage =
        'Rendimiento académico satisfactorio. Cumples con los estándares aprobatorios regulares del plan de estudios.';
    }
  } else {
    status = 'failed';
    statusMessage = `Condición académica desaprobatoria. El promedio ponderado (${weightedAverage}) es inferior a la nota mínima de aprobación reglamentaria (${passingGrade}).`;
  }

  // Generate formula breakdown steps
  const formulaSteps: FormulaStep[] = coursesBreakdown.map((item) => ({
    label: item.name,
    value: `${item.grade.toFixed(1)} × ${item.credits} cr. = ${item.points.toFixed(2)} pts`,
    detail: item.isPassing ? 'Aprobado' : 'Desaprobado',
  }));

  formulaSteps.push(
    {
      label: 'Suma de Puntos Ponderados (∑ Ni · Ci)',
      value: `${roundedTotalPoints.toFixed(2)} pts`,
    },
    {
      label: 'Total de Créditos Matriculados (∑ Ci)',
      value: `${roundedTotalCredits} créditos`,
    },
    {
      label: 'Promedio Ponderado Final',
      value: `${roundedTotalPoints.toFixed(2)} ÷ ${roundedTotalCredits} = ${weightedAverage.toFixed(2)} sobre ${maxScale}`,
    }
  );

  const { canonicalLatex, substitutionLatex, formulaString } = formatGpaFormula(input, {
    weightedAverage,
    totalCredits: roundedTotalCredits,
    totalPoints: roundedTotalPoints,
  });

  return {
    weightedAverage,
    totalCredits: roundedTotalCredits,
    totalPoints: roundedTotalPoints,
    status,
    statusMessage,
    formulaSteps,
    canonicalLatex,
    substitutionLatex,
    formulaString,
    coursesBreakdown,
    approvedCredits,
    failedCredits,
    isValid,
    errors,
  };
}
