export type OperationMode = 'durations' | 'clock' | 'timesheet';

export interface TimeDuration {
  id: string;
  hours: number | '';
  minutes: number | '';
  seconds?: number | '';
  isNegative?: boolean;
  label?: string;
}

export interface DurationsInput {
  mode: 'durations';
  durations: TimeDuration[];
}

export interface ClockInput {
  mode: 'clock';
  startTime: string; // "HH:mm" or "HH:mm:ss"
  duration: {
    hours: number | '';
    minutes: number | '';
    seconds?: number | '';
  };
  isAdd: boolean; // true to add duration, false to subtract
}

export interface TimesheetInput {
  mode: 'timesheet';
  entryTime: string; // "HH:mm"
  exitTime: string; // "HH:mm"
  breakMinutes: number | '';
  hourlyRate?: number | '';
}

export type TimeCalculationInput = DurationsInput | ClockInput | TimesheetInput;

export interface FormulaStep {
  label: string;
  value: string;
}

export interface TimeCalculationResult {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalSignedSeconds: number;
  isNegative: boolean;
  formattedTime: string; // e.g. "8h 30m 00s" or "8h 30m"
  digitalTime: string; // e.g. "08:30:00"
  decimalHours: number; // e.g. 8.5
  decimalHoursFormatted: string; // e.g. "8.50 hrs"
  stepDescription: string;
  isOverMidnight: boolean;
  formulaSteps: FormulaStep[];
  canonicalLatex?: string;
  substitutionLatex?: string;
}

export interface ClockCalculationResult extends TimeCalculationResult {
  startTime: string;
  targetClock: string; // e.g. "17:30"
  daysOffset: number; // 0: same day, 1: next day, -1: previous day
  isAdd: boolean;
  dayShiftDescription: string;
}

export interface TimesheetResult extends TimeCalculationResult {
  entryTime: string;
  exitTime: string;
  grossSeconds: number;
  grossHours: number;
  grossMinutes: number;
  grossFormatted: string;
  breakMinutes: number;
  netSeconds: number;
  netHours: number;
  netMinutes: number;
  netFormatted: string;
  estimatedEarnings?: number;
}
