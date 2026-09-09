import { FinalGradeInput, FinalGradeResult, FinalGradeStatus } from './types';

/**
 * Pure Mathematical Domain Service for Final Grade Calculation.
 * Independent of React, DOM, or external frameworks.
 */

export function validateFinalGradeInput(input: FinalGradeInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const maxScale = input.maxScale && input.maxScale > 0 ? input.maxScale : 20;

  if (!input.passingThreshold || input.passingThreshold <= 0 || input.passingThreshold > maxScale) {
    errors.passingThreshold = `La nota aprobatoria debe estar entre 0.1 y ${maxScale}.`;
  }

  const finalWeight = typeof input.finalExamWeight === 'number' ? input.finalExamWeight : 0;
  if (finalWeight <= 0 || finalWeight > 100) {
    errors.finalExamWeight = 'El peso del examen final debe ser mayor a 0% y menor a 100%.';
  }

  let totalWeight = finalWeight;
  input.evaluations.forEach((ev, idx) => {
    const score = typeof ev.score === 'number' ? ev.score : 0;
    const weight = typeof ev.weight === 'number' ? ev.weight : 0;

    if (score < 0 || score > maxScale) {
      errors[`eval_score_${idx}`] = `La nota de "${ev.name || `Eval ${idx + 1}`}" debe estar entre 0 y ${maxScale}.`;
    }
    if (weight < 0 || weight > 100) {
      errors[`eval_weight_${idx}`] = `El peso debe estar entre 0% y 100%.`;
    }
    totalWeight += weight;
  });

  if (totalWeight > 100) {
    errors.totalWeight = `El peso total acumulado (${totalWeight}%) supera el 100%.`;
  }

  return errors;
}

export function calculateFinalGrade(input: FinalGradeInput): FinalGradeResult {
  const errors = validateFinalGradeInput(input);
  const isValid = Object.keys(errors).length === 0;
  const maxScale = input.maxScale && input.maxScale > 0 ? input.maxScale : 20;

  const finalExamWeight = typeof input.finalExamWeight === 'number' ? input.finalExamWeight : 0;
  let accumulatedPoints = 0;
  let accumulatedWeight = 0;

  input.evaluations.forEach((ev) => {
    const score = typeof ev.score === 'number' ? ev.score : 0;
    const weight = typeof ev.weight === 'number' ? ev.weight : 0;
    accumulatedPoints += score * (weight / 100);
    accumulatedWeight += weight;
  });

  const totalAllocatedWeight = accumulatedWeight + finalExamWeight;

  // If weights aren't yet specified or final exam weight is 0
  if (finalExamWeight <= 0) {
    return {
      accumulatedPoints: Number(accumulatedPoints.toFixed(2)),
      accumulatedWeight,
      finalExamWeight,
      totalAllocatedWeight,
      requiredFinalScore: 0,
      status: 'feasible',
      statusMessage: 'Ingresa el peso del examen final para calcular.',
      formulaString: 'Nota Requerida = (Nota Aprobatoria - Puntos Acumulados) / Peso Examen Final',
      canonicalLatex: 'N_{\\text{final}} = \\frac{U_{\\text{aprobatorio}} - \\sum_{i=1}^{n} (N_i \\cdot w_i)}{w_{\\text{final}}}',
      substitutionLatex: '',
      formulaSteps: [],
      isValid: false,
      errors,
    };
  }

  const remainingPointsNeeded = input.passingThreshold - accumulatedPoints;
  const rawRequiredScore = remainingPointsNeeded / (finalExamWeight / 100);
  const roundedRequiredScore = Math.max(0, Number(rawRequiredScore.toFixed(2)));

  let status: FinalGradeStatus;
  let statusMessage: string;

  const scoreRatio = roundedRequiredScore / maxScale;

  if (accumulatedPoints >= input.passingThreshold) {
    status = 'approved';
    statusMessage = '¡Felicidades! Ya alcanzaste el puntaje aprobatorio con tus notas acumuladas. No necesitas puntos en el examen final.';
  } else if (scoreRatio <= 0.70) {
    status = 'feasible';
    statusMessage = 'Meta alcanzable con estudio regular y preparación estándar.';
  } else if (scoreRatio <= 1.0) {
    status = 'challenging';
    statusMessage = 'Exigente. Necesitas un examen sobresaliente para asegurar la aprobación.';
  } else {
    status = 'impossible';
    statusMessage = `Matemáticamente inalcanzable en el examen ordinario (requiere ${roundedRequiredScore} sobre ${maxScale}). Considera revisar las opciones de recuperación o sustitutorio.`;
  }

  const formulaString = `Nota Final Requerida = (${input.passingThreshold} - ${accumulatedPoints.toFixed(2)}) / (${finalExamWeight} / 100) = ${roundedRequiredScore}`;
  const canonicalLatex = `N_{\\text{final}} = \\frac{U_{\\text{aprobatorio}} - \\sum_{i=1}^{n} (N_i \\cdot w_i)}{w_{\\text{final}}}`;
  const substitutionLatex = `N_{\\text{final}} = \\frac{${input.passingThreshold.toFixed(2)} - ${accumulatedPoints.toFixed(2)}}{${(finalExamWeight / 100).toFixed(2)}} = \\mathbf{${roundedRequiredScore}} \\text{ / ${maxScale}}`;

  const formulaSteps = [
    { label: 'Nota mínima deseada (U)', value: `${input.passingThreshold.toFixed(2)}` },
    { label: 'Puntos acumulados a la fecha (∑ Ni · wi)', value: `${accumulatedPoints.toFixed(2)} pts` },
    { label: 'Puntos faltantes para aprobar', value: `${Math.max(0, remainingPointsNeeded).toFixed(2)} pts` },
    { label: 'Peso del examen final (wf)', value: `${finalExamWeight}%` },
    { label: 'Nota mínima requerida en el final', value: `${roundedRequiredScore} sobre ${maxScale}` },
  ];

  return {
    accumulatedPoints: Number(accumulatedPoints.toFixed(2)),
    accumulatedWeight,
    finalExamWeight,
    totalAllocatedWeight,
    requiredFinalScore: roundedRequiredScore,
    status,
    statusMessage,
    formulaString,
    canonicalLatex,
    substitutionLatex,
    formulaSteps,
    isValid,
    errors,
  };
}
