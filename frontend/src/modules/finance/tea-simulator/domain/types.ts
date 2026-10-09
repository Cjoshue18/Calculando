export interface TeaInput {
  loanAmount: number; // Monto solicitado (S/ o $)
  teaPercentage: number; // Tasa Efectiva Anual en % (ej. 24.5%)
  termMonths: number; // Plazo en meses (ej. 12, 24, 36)
  desgravamenRateMonthly: number; // Seguro de desgravamen mensual en % (ej. 0.075%)
}

export interface AmortizationRow {
  month: number;
  beginningBalance: number;
  principal: number; // Amortización capital
  interest: number; // Interés del mes
  desgravamen: number; // Seguro desgravamen
  totalPayment: number; // Cuota total
  endingBalance: number;
}

export interface TeaResult {
  monthlyTemPercentage: number; // Tasa Efectiva Mensual (%)
  monthlyBasePayment: number; // Cuota fija capital + interés
  monthlyDesgravamenInitial: number; // Seguro desgravamen mes 1
  monthlyTotalInitialPayment: number; // Cuota total mes 1
  totalInterestPaid: number; // Total intereses a pagar
  totalDesgravamenPaid: number; // Total seguros pagados
  totalCostOfCredit: number; // Monto final desembolsado
  approximateTceaPercentage: number; // TCEA estimada
  canonicalLatex: string;
  substitutionLatex: string;
  formulaSteps: { label: string; value: string }[];
  scheduleSummary: AmortizationRow[];
}
