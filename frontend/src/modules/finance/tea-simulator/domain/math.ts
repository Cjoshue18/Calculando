import { TeaInput, TeaResult, AmortizationRow } from './types';

export function calculateTeaSimulation(input: TeaInput): TeaResult {
  const principal = Math.max(0, input.loanAmount || 0);
  const teaDec = Math.max(0, input.teaPercentage || 0) / 100;
  const n = Math.max(1, Math.min(360, Math.round(input.termMonths || 12)));
  const desgravamenRateMonthly = Math.max(0, input.desgravamenRateMonthly || 0) / 100;

  // 1. Tasa Efectiva Mensual (TEM) a partir de la TEA
  // TEM = (1 + TEA)^(1/12) - 1
  const temDec = Math.pow(1 + teaDec, 1 / 12) - 1;
  const monthlyTemPercentage = Math.round(temDec * 100 * 10000) / 10000; // 4 decimals

  // 2. Cuota fija mensual bajo Sistema Francés (Capital + Interés)
  // C = P * [ TEM * (1 + TEM)^n ] / [ (1 + TEM)^n - 1 ]
  let monthlyBasePayment = 0;
  if (temDec > 0) {
    const factor = Math.pow(1 + temDec, n);
    monthlyBasePayment = principal * ((temDec * factor) / (factor - 1));
  } else {
    monthlyBasePayment = principal / n;
  }
  monthlyBasePayment = Math.round(monthlyBasePayment * 100) / 100;

  // 3. Generar cronograma y acumular totales
  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterestPaid = 0;
  let totalDesgravamenPaid = 0;

  for (let month = 1; month <= n; month++) {
    const interest = Math.round(currentBalance * temDec * 100) / 100;
    const desgravamen = Math.round(currentBalance * desgravamenRateMonthly * 100) / 100;
    let principalPaid = Math.round((monthlyBasePayment - interest) * 100) / 100;

    // En el último mes, ajustar para que el balance cierre en 0 exacto
    if (month === n || principalPaid > currentBalance) {
      principalPaid = currentBalance;
    }

    const endingBalance = Math.max(0, Math.round((currentBalance - principalPaid) * 100) / 100);
    const totalPayment = Math.round((principalPaid + interest + desgravamen) * 100) / 100;

    totalInterestPaid += interest;
    totalDesgravamenPaid += desgravamen;

    schedule.push({
      month,
      beginningBalance: currentBalance,
      principal: principalPaid,
      interest,
      desgravamen,
      totalPayment,
      endingBalance,
    });

    currentBalance = endingBalance;
  }

  totalInterestPaid = Math.round(totalInterestPaid * 100) / 100;
  totalDesgravamenPaid = Math.round(totalDesgravamenPaid * 100) / 100;
  const totalCostOfCredit = Math.round((principal + totalInterestPaid + totalDesgravamenPaid) * 100) / 100;

  const monthlyDesgravamenInitial = schedule.length > 0 ? schedule[0].desgravamen : 0;
  const monthlyTotalInitialPayment = schedule.length > 0 ? schedule[0].totalPayment : monthlyBasePayment;

  // 4. Cálculo de TCEA aproximada usando TIR Newton-Raphson
  let approxTcea = input.teaPercentage;
  if (totalDesgravamenPaid > 0 && principal > 0) {
    // Estimación de TIR mensual
    let r = temDec + desgravamenRateMonthly;
    for (let iter = 0; iter < 20; iter++) {
      let npv = -principal;
      let dNpv = 0;
      for (let t = 1; t <= n; t++) {
        const payment = schedule[t - 1].totalPayment;
        const discount = Math.pow(1 + r, t);
        npv += payment / discount;
        dNpv -= (t * payment) / (discount * (1 + r));
      }
      if (Math.abs(dNpv) < 1e-9) break;
      const newR = r - npv / dNpv;
      if (Math.abs(newR - r) < 1e-6) {
        r = newR;
        break;
      }
      r = newR;
    }
    // Anualizar: TCEA = (1 + r)^12 - 1
    const tceaDec = Math.pow(1 + Math.max(0, r), 12) - 1;
    approxTcea = Math.round(tceaDec * 100 * 100) / 100;
  }

  // LaTeX Canonical
  const canonicalLatex = 'TEM = (1 + \\text{TEA})^{\\frac{1}{12}} - 1, \\quad C = P \\cdot \\frac{TEM \\cdot (1 + TEM)^n}{(1 + TEM)^n - 1}';

  // LaTeX Substitution
  const substitutionLatex = `TEM = (1 + ${(teaDec).toFixed(4)})^{\\frac{1}{12}} - 1 = \\mathbf{${monthlyTemPercentage.toFixed(2)}\\%}, \\quad C = \\mathbf{S/\\;${monthlyBasePayment.toFixed(2)}}`;

  const formulaSteps = [
    {
      label: 'Tasa Efectiva Mensual (TEM)',
      value: `${monthlyTemPercentage.toFixed(3)}% mensual`,
    },
    {
      label: 'Cuota Base Mensual (Capital + Interés)',
      value: `S/ ${monthlyBasePayment.toFixed(2)}`,
    },
    {
      label: 'Seguro de Desgravamen Inicial (Mes 1)',
      value: `S/ ${monthlyDesgravamenInitial.toFixed(2)}`,
    },
    {
      label: 'Cuota Total Estimada (Mes 1)',
      value: `S/ ${monthlyTotalInitialPayment.toFixed(2)}`,
    },
    {
      label: 'Total de Intereses Acumulados',
      value: `S/ ${totalInterestPaid.toFixed(2)}`,
    },
    {
      label: 'Costo Total del Crédito (Devolución Total)',
      value: `S/ ${totalCostOfCredit.toFixed(2)}`,
    },
  ];

  return {
    monthlyTemPercentage,
    monthlyBasePayment,
    monthlyDesgravamenInitial,
    monthlyTotalInitialPayment,
    totalInterestPaid,
    totalDesgravamenPaid,
    totalCostOfCredit,
    approximateTceaPercentage: approxTcea,
    canonicalLatex,
    substitutionLatex,
    formulaSteps,
    scheduleSummary: schedule.slice(0, 12), // First 12 months for preview
  };
}

export function validateTeaInput(input: TeaInput): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (input.loanAmount <= 0) {
    errors.loanAmount = 'El monto del préstamo debe ser mayor a 0.';
  }
  if (input.teaPercentage < 0 || input.teaPercentage > 500) {
    errors.teaPercentage = 'La TEA debe estar entre 0% y 500%.';
  }
  if (input.termMonths < 1 || input.termMonths > 360) {
    errors.termMonths = 'El plazo debe ser entre 1 y 360 meses.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
