export interface RentaQuintaInput {
  monthlySalary: number; // Sueldo bruto mensual (S/)
  uitValue?: number; // Valor de la UIT (default S/ 5,150)
  hasGratifications?: boolean; // ¿Percibe 2 gratificaciones al año (Julio y Diciembre)?
  additionalDeductionUit?: number; // Gastos deducibles adicionales (hasta 3 UIT)
}

export interface TaxBracketResult {
  bracket: string;
  uitRange: string;
  taxableAmountInBracket: number;
  rate: number;
  taxAmount: number;
}

export interface RentaQuintaResult {
  annualGrossIncome: number; // Ingresos brutos anuales proyectados
  base7UitDeduction: number; // Deducción fija obligatoria de 7 UIT
  additionalDeduction: number; // Deducción adicional de hasta 3 UIT
  netTaxableIncome: number; // Renta neta imponible anual sujeta a impuesto
  annualTax: number; // Impuesto a la renta anual total
  monthlyWithholding: number; // Retención mensual promedio en boleta
  effectiveRatePercentage: number; // Tasa efectiva real sobre el sueldo bruto
  brackets: TaxBracketResult[];
  canonicalLatex: string;
  substitutionLatex: string;
  formulaSteps: { label: string; value: string }[];
}
