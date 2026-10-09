import { IgvInput, IgvResult, DetractionOption } from './types';

export const DETRACTION_OPTIONS: DetractionOption[] = [
  { id: 'none', label: 'Sin detracción (0%)', rate: 0 },
  { id: 'services_12', label: 'Demás servicios en general (12%)', rate: 0.12 },
  { id: 'transport_4', label: 'Transporte de bienes por carretera (4%)', rate: 0.04 },
  { id: 'lease_10', label: 'Arrendamiento de bienes muebles/inmuebles (10%)', rate: 0.10 },
  { id: 'maintenance_12', label: 'Mantenimiento y reparación de bienes (12%)', rate: 0.12 },
  { id: 'construction_4', label: 'Contratos de construcción (4%)', rate: 0.04 },
];

export const SPOT_THRESHOLD_PEN = 700; // S/. 700 threshold for detractions in Peru

export function calculateIgv(input: IgvInput): IgvResult {
  const rawAmount = Math.max(0, input.amount || 0);
  const selectedOption = DETRACTION_OPTIONS.find((o) => o.id === input.detractionType);
  const detractionRate = selectedOption ? selectedOption.rate : (input.customDetractionRate || 0);

  let baseAmount: number;
  let igvAmount: number;
  let totalAmount: number;

  if (input.mode === 'add') {
    // Input is Base Imponible
    baseAmount = Math.round(rawAmount * 100) / 100;
    igvAmount = Math.round(baseAmount * 0.18 * 100) / 100;
    totalAmount = Math.round((baseAmount + igvAmount) * 100) / 100;
  } else {
    // Input is Total Amount (Desglose)
    totalAmount = Math.round(rawAmount * 100) / 100;
    baseAmount = Math.round((totalAmount / 1.18) * 100) / 100;
    igvAmount = Math.round((totalAmount - baseAmount) * 100) / 100;
  }

  // Detraction applies if totalAmount > S/ 700 and rate > 0
  const appliesDetraction = totalAmount > SPOT_THRESHOLD_PEN && detractionRate > 0;
  // Detraction in Sunat is rounded to the nearest integer
  const detractionAmount = appliesDetraction ? Math.round(totalAmount * detractionRate) : 0;
  const netPayableAmount = Math.round((totalAmount - detractionAmount) * 100) / 100;

  // Canonical LaTeX
  const canonicalLatex = input.mode === 'add'
    ? '\\text{Total} = \\text{Base} \\cdot (1 + 0.18) = \\text{Base} + \\text{IGV}'
    : '\\text{Base} = \\frac{\\text{Total}}{1.18}, \\quad \\text{IGV} = \\text{Total} - \\text{Base}';

  // Substitution LaTeX
  const substitutionLatex = input.mode === 'add'
    ? `\\text{Total} = ${baseAmount.toFixed(2)} + ${igvAmount.toFixed(2)} = \\mathbf{S/\\;${totalAmount.toFixed(2)}}`
    : `\\text{Base} = \\frac{${totalAmount.toFixed(2)}}{1.18} = \\mathbf{S/\\;${baseAmount.toFixed(2)}}, \\quad \\text{IGV} = \\mathbf{S/\\;${igvAmount.toFixed(2)}}`;

  const formulaSteps = [
    {
      label: 'Base Imponible (Subtotal)',
      value: `S/ ${baseAmount.toFixed(2)}`,
    },
    {
      label: 'IGV (18%)',
      value: `S/ ${igvAmount.toFixed(2)}`,
    },
    {
      label: 'Importe Total',
      value: `S/ ${totalAmount.toFixed(2)}`,
    },
  ];

  if (appliesDetraction) {
    formulaSteps.push(
      {
        label: `Detracción SPOT (${(detractionRate * 100).toFixed(0)}%) - Banco de la Nación`,
        value: `S/ ${detractionAmount.toFixed(2)}`,
      },
      {
        label: 'Neto a Pagar al Proveedor',
        value: `S/ ${netPayableAmount.toFixed(2)}`,
      }
    );
  }

  return {
    baseAmount,
    igvAmount,
    totalAmount,
    detractionRate,
    detractionAmount,
    netPayableAmount,
    appliesDetraction,
    canonicalLatex,
    substitutionLatex,
    formulaSteps,
  };
}

export function validateIgvInput(input: IgvInput): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (input.amount < 0) {
    errors.amount = 'El monto no puede ser negativo.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
