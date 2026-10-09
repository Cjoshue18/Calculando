import { RentaQuintaInput, RentaQuintaResult, TaxBracketResult } from './types';

export const DEFAULT_UIT_2026 = 5150; // S/. 5,150

export function calculateRentaQuinta(input: RentaQuintaInput): RentaQuintaResult {
  const salary = Math.max(0, input.monthlySalary || 0);
  const uit = Math.max(1, input.uitValue || DEFAULT_UIT_2026);
  const hasGrat = input.hasGratifications !== false; // Default true
  const addDeduction = Math.min(3 * uit, Math.max(0, input.additionalDeductionUit || 0));

  // 1. Renta Bruta Anual
  // 12 meses ordinarios + 2 gratificaciones ordinarias + bonificación extraordinaria de 9% por Ley 30334
  const annualGrossIncome = hasGrat
    ? Math.round((salary * 12 + salary * 2 + salary * 2 * 0.09) * 100) / 100
    : Math.round(salary * 12 * 100) / 100;

  // 2. Deducción fija inafecta de 7 UIT (Art. 46 Ley del Impuesto a la Renta)
  const base7UitDeduction = 7 * uit;

  // 3. Renta Neta Imponible
  const netTaxableIncome = Math.max(0, Math.round((annualGrossIncome - base7UitDeduction - addDeduction) * 100) / 100);

  // 4. Escala Progresiva Acumulativa (Art. 53 LIR)
  // Tramo 1: Hasta 5 UIT (8%)
  // Tramo 2: > 5 UIT hasta 20 UIT (14%) -> ancho 15 UIT
  // Tramo 3: > 20 UIT hasta 35 UIT (17%) -> ancho 15 UIT
  // Tramo 4: > 35 UIT hasta 45 UIT (20%) -> ancho 10 UIT
  // Tramo 5: Más de 45 UIT (30%)
  const bracketDefs = [
    { label: 'Tramo 1 (Hasta 5 UIT)', uitRange: `Hasta S/ ${(5 * uit).toLocaleString()}`, limit: 5 * uit, rate: 0.08 },
    { label: 'Tramo 2 (5 a 20 UIT)', uitRange: `De S/ ${(5 * uit).toLocaleString()} a S/ ${(20 * uit).toLocaleString()}`, limit: 15 * uit, rate: 0.14 },
    { label: 'Tramo 3 (20 a 35 UIT)', uitRange: `De S/ ${(20 * uit).toLocaleString()} a S/ ${(35 * uit).toLocaleString()}`, limit: 15 * uit, rate: 0.17 },
    { label: 'Tramo 4 (35 a 45 UIT)', uitRange: `De S/ ${(35 * uit).toLocaleString()} a S/ ${(45 * uit).toLocaleString()}`, limit: 10 * uit, rate: 0.20 },
    { label: 'Tramo 5 (Más de 45 UIT)', uitRange: `Exceso sobre S/ ${(45 * uit).toLocaleString()}`, limit: Infinity, rate: 0.30 },
  ];

  let remainingTaxable = netTaxableIncome;
  let annualTax = 0;
  const brackets: TaxBracketResult[] = [];

  for (const b of bracketDefs) {
    if (remainingTaxable <= 0) {
      brackets.push({
        bracket: b.label,
        uitRange: b.uitRange,
        taxableAmountInBracket: 0,
        rate: b.rate,
        taxAmount: 0,
      });
      continue;
    }

    const taxableInThisBracket = Math.min(remainingTaxable, b.limit);
    const taxInThisBracket = Math.round(taxableInThisBracket * b.rate * 100) / 100;

    brackets.push({
      bracket: b.label,
      uitRange: b.uitRange,
      taxableAmountInBracket: taxableInThisBracket,
      rate: b.rate,
      taxAmount: taxInThisBracket,
    });

    annualTax += taxInThisBracket;
    remainingTaxable -= taxableInThisBracket;
  }

  annualTax = Math.round(annualTax * 100) / 100;
  const monthlyWithholding = Math.round((annualTax / 12) * 100) / 100;
  const effectiveRatePercentage = annualGrossIncome > 0
    ? Math.round((annualTax / annualGrossIncome) * 100 * 100) / 100
    : 0;

  // LaTeX Canonical
  const canonicalLatex = '\\text{Renta Neta} = \\max(0, \\text{Renta Bruta Anual} - 7\\text{ UIT}), \\quad \\text{Impuesto Anual} = \\sum_{k=1}^{5} (B_k \\cdot t_k)';

  // LaTeX Substitution
  const substitutionLatex = `\\text{Renta Neta} = ${annualGrossIncome.toFixed(2)} - ${base7UitDeduction.toFixed(2)} = \\mathbf{S/\\;${netTaxableIncome.toFixed(2)}}, \\quad \\text{Retención Mensual} = \\mathbf{S/\\;${monthlyWithholding.toFixed(2)}}`;

  const formulaSteps = [
    {
      label: 'Renta Bruta Anual Proyectada',
      value: `S/ ${annualGrossIncome.toFixed(2)}`,
    },
    {
      label: 'Deducción Inafecta de Ley (7 UIT)',
      value: `- S/ ${base7UitDeduction.toFixed(2)}`,
    },
    {
      label: 'Renta Neta Imponible Anual',
      value: `S/ ${netTaxableIncome.toFixed(2)}`,
    },
    {
      label: 'Impuesto a la Renta Anual Total',
      value: `S/ ${annualTax.toFixed(2)}`,
    },
    {
      label: 'Retención Promedio Mensual en Boleta',
      value: `S/ ${monthlyWithholding.toFixed(2)}`,
    },
    {
      label: 'Tasa Efectiva Real sobre Ingresos',
      value: `${effectiveRatePercentage.toFixed(2)}%`,
    },
  ];

  return {
    annualGrossIncome,
    base7UitDeduction,
    additionalDeduction: addDeduction,
    netTaxableIncome,
    annualTax,
    monthlyWithholding,
    effectiveRatePercentage,
    brackets,
    canonicalLatex,
    substitutionLatex,
    formulaSteps,
  };
}

export function validateRentaQuintaInput(input: RentaQuintaInput): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (input.monthlySalary < 0) {
    errors.monthlySalary = 'El sueldo mensual no puede ser negativo.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
