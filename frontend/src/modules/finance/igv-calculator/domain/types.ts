export type IgvOperationMode = 'add' | 'extract';

export type DetractionRateType = 'none' | 'services_12' | 'transport_4' | 'lease_10' | 'maintenance_12' | 'construction_4';

export interface DetractionOption {
  id: DetractionRateType;
  label: string;
  rate: number; // e.g. 0.12
}

export interface IgvInput {
  amount: number;
  mode: IgvOperationMode; // 'add' (monto base -> suma 18%) or 'extract' (monto total -> desglosa 18%)
  detractionType: DetractionRateType;
  customDetractionRate?: number;
}

export interface IgvResult {
  baseAmount: number;
  igvAmount: number;
  totalAmount: number;
  detractionRate: number; // e.g. 0.12
  detractionAmount: number;
  netPayableAmount: number;
  appliesDetraction: boolean; // SPOT only applies if total > S/ 700
  canonicalLatex: string;
  substitutionLatex: string;
  formulaSteps: { label: string; value: string }[];
}
