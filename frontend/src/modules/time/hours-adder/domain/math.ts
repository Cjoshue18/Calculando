import {
  TimeCalculationResult,
  ClockCalculationResult,
  TimesheetResult,
  TimeCalculationInput,
} from './types';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

/**
 * Parse time string ("HH:mm" or "HH:mm:ss") to total seconds from midnight.
 */
export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  const h = parseInt(parts[0] || '0', 10) || 0;
  const m = parseInt(parts[1] || '0', 10) || 0;
  const s = parseInt(parts[2] || '0', 10) || 0;
  return h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
}

/**
 * Converts signed seconds into sexagesimal breakdown (hours, minutes, seconds).
 */
export function secondsToSexagesimal(totalSignedSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
  isNegative: boolean;
} {
  const isNegative = totalSignedSeconds < 0;
  const absSeconds = Math.abs(Math.round(totalSignedSeconds));
  const hours = Math.floor(absSeconds / SECONDS_PER_HOUR);
  const remainingSeconds = absSeconds % SECONDS_PER_HOUR;
  const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
  const seconds = remainingSeconds % SECONDS_PER_MINUTE;

  return { hours, minutes, seconds, isNegative };
}

/**
 * Converts seconds to decimal hours rounded to 2 decimal places.
 * e.g. 27000 seconds (7h 30m) -> 7.50
 */
export function secondsToDecimalHours(totalSignedSeconds: number): number {
  const decimal = totalSignedSeconds / SECONDS_PER_HOUR;
  return Number(decimal.toFixed(2));
}

/**
 * Formats sexagesimal components into readable string like "8h 30m" or "-2h 15m 30s".
 */
export function formatSexagesimal(
  hours: number,
  minutes: number,
  seconds: number = 0,
  isNegative: boolean = false
): string {
  const sign = isNegative ? '-' : '';
  const minPad = minutes.toString().padStart(2, '0');
  const secStr = seconds > 0 ? ` ${seconds.toString().padStart(2, '0')}s` : '';
  return `${sign}${hours}h ${minPad}m${secStr}`;
}

/**
 * Formats components into digital clock notation: "[±]HH:MM:SS".
 */
export function formatDigitalClock(
  hours: number,
  minutes: number,
  seconds: number = 0,
  isNegative: boolean = false
): string {
  const sign = isNegative ? '-' : '';
  const hPad = hours.toString().padStart(2, '0');
  const mPad = minutes.toString().padStart(2, '0');
  const sPad = seconds.toString().padStart(2, '0');
  return `${sign}${hPad}:${mPad}:${sPad}`;
}

/**
 * Mode 1: Add or subtract multiple time durations.
 * Pure sexagesimal arithmetic with zero external libraries.
 */
export function addDurations(
  durations: Array<{
    hours?: number | '';
    minutes?: number | '';
    seconds?: number | '';
    isNegative?: boolean;
    label?: string;
  }>
): TimeCalculationResult {
  if (!durations || durations.length === 0) {
    return {
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      totalSignedSeconds: 0,
      isNegative: false,
      formattedTime: '0h 00m',
      digitalTime: '00:00:00',
      decimalHours: 0,
      decimalHoursFormatted: '0.00 hrs',
      stepDescription: 'Sin duraciones registradas.',
      isOverMidnight: false,
      formulaSteps: [],
      canonicalLatex: 'T_{total} = \\sum_{i=1}^{n} (\\pm T_i)',
      substitutionLatex: 'T_{total} = 0\\text{h } 00\\text{m}',
    };
  }

  let totalSignedSeconds = 0;
  const parsedDurations: Array<{ h: number; m: number; s: number; isNegative: boolean; sec: number }> = [];

  for (const d of durations) {
    const h = typeof d.hours === 'number' && !isNaN(d.hours) ? Math.max(0, Math.floor(d.hours)) : 0;
    const m = typeof d.minutes === 'number' && !isNaN(d.minutes) ? Math.max(0, Math.floor(d.minutes)) : 0;
    const s = typeof d.seconds === 'number' && !isNaN(d.seconds) ? Math.max(0, Math.floor(d.seconds)) : 0;
    const isNegative = Boolean(d.isNegative);

    const itemSec = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
    const signedItemSec = isNegative ? -itemSec : itemSec;

    totalSignedSeconds += signedItemSec;
    parsedDurations.push({ h, m, s, isNegative, sec: signedItemSec });
  }

  const { hours, minutes, seconds, isNegative } = secondsToSexagesimal(totalSignedSeconds);
  const decimalHours = secondsToDecimalHours(totalSignedSeconds);
  const decimalHoursFormatted = `${decimalHours >= 0 ? '' : '-'}${Math.abs(decimalHours).toFixed(2)} hrs`;
  const formattedTime = formatSexagesimal(hours, minutes, seconds, isNegative);
  const digitalTime = formatDigitalClock(hours, minutes, seconds, isNegative);

  const formulaSteps = [
    {
      label: 'Total segundos acumulados',
      value: `${totalSignedSeconds.toLocaleString('es-PE')} s`,
    },
    {
      label: 'Horas enteras computadas (división por 3600)',
      value: `${isNegative ? '-' : ''}${hours} h`,
    },
    {
      label: 'Minutos residuales (resto sexagesimal en 60)',
      value: `${minutes} m`,
    },
  ];

  if (seconds > 0) {
    formulaSteps.push({
      label: 'Segundos residuales',
      value: `${seconds} s`,
    });
  }

  formulaSteps.push({
    label: 'Equivalente en horas decimales (h + m/60)',
    value: `${decimalHoursFormatted} (factor nómina: ${decimalHours})`,
  });

  // Build LaTeX representation
  const termsLatex = parsedDurations.map((d, index) => {
    const sign = d.isNegative ? '-' : (index > 0 ? '+' : '');
    return `${sign}(${d.h}\\text{h } ${d.m.toString().padStart(2, '0')}\\text{m}${d.s > 0 ? ' ' + d.s + '\\text{s}' : ''})`;
  }).join(' ');

  const canonicalLatex = 'T_{total} = \\sum_{i=1}^{n} (\\pm (H_i \\cdot 3600 + M_i \\cdot 60 + S_i))';
  const substitutionLatex = `T_{total} = ${termsLatex || '0\\text{h }00\\text{m}'} = ${isNegative ? '-' : ''}${hours}\\text{h } ${minutes.toString().padStart(2, '0')}\\text{m} = ${decimalHours.toFixed(2)}\\text{ hrs}`;

  return {
    totalHours: hours,
    totalMinutes: minutes,
    totalSeconds: seconds,
    totalSignedSeconds,
    isNegative,
    formattedTime,
    digitalTime,
    decimalHours,
    decimalHoursFormatted,
    stepDescription: `Suma sexagesimal de ${durations.length} elementos: ${formattedTime} equivalente a ${decimalHoursFormatted}`,
    isOverMidnight: hours >= 24,
    formulaSteps,
    canonicalLatex,
    substitutionLatex,
  };
}

/**
 * Mode 2: Calculate target clock time given a start clock time and a duration to add/subtract.
 */
export function calculateClockTime(
  startTime: string,
  duration: {
    hours?: number | '';
    minutes?: number | '';
    seconds?: number | '';
  },
  isAdd: boolean = true
): ClockCalculationResult {
  const startSeconds = parseTimeToSeconds(startTime || '00:00');
  const dh = typeof duration.hours === 'number' && !isNaN(duration.hours) ? Math.max(0, Math.floor(duration.hours)) : 0;
  const dm = typeof duration.minutes === 'number' && !isNaN(duration.minutes) ? Math.max(0, Math.floor(duration.minutes)) : 0;
  const ds = typeof duration.seconds === 'number' && !isNaN(duration.seconds) ? Math.max(0, Math.floor(duration.seconds)) : 0;

  const durationSeconds = dh * SECONDS_PER_HOUR + dm * SECONDS_PER_MINUTE + ds;
  const rawTargetSeconds = isAdd ? startSeconds + durationSeconds : startSeconds - durationSeconds;

  const daysOffset = Math.floor(rawTargetSeconds / SECONDS_PER_DAY);
  const normalizedSeconds = ((rawTargetSeconds % SECONDS_PER_DAY) + SECONDS_PER_DAY) % SECONDS_PER_DAY;

  const targetH = Math.floor(normalizedSeconds / SECONDS_PER_HOUR);
  const targetM = Math.floor((normalizedSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const targetS = normalizedSeconds % SECONDS_PER_MINUTE;

  const targetClock = `${targetH.toString().padStart(2, '0')}:${targetM.toString().padStart(2, '0')}${targetS > 0 ? ':' + targetS.toString().padStart(2, '0') : ''}`;
  const digitalTime = `${targetH.toString().padStart(2, '0')}:${targetM.toString().padStart(2, '0')}:${targetS.toString().padStart(2, '0')}`;
  const isOverMidnight = daysOffset !== 0;

  let dayShiftDescription = 'Mismo día';
  if (daysOffset === 1) {
    dayShiftDescription = 'Día siguiente (+1 día)';
  } else if (daysOffset > 1) {
    dayShiftDescription = `+${daysOffset} días después`;
  } else if (daysOffset === -1) {
    dayShiftDescription = 'Día anterior (-1 día)';
  } else if (daysOffset < -1) {
    dayShiftDescription = `${Math.abs(daysOffset)} días antes`;
  }

  const durationDecimalHours = Number((durationSeconds / SECONDS_PER_HOUR).toFixed(2));
  const decimalHoursFormatted = `${durationDecimalHours.toFixed(2)} hrs`;

  const canonicalLatex = 'T_{reloj} = (T_{inicio} \\pm \\Delta T) \\pmod{24\\text{ h}}';
  const opSymbol = isAdd ? '+' : '-';
  const durationStr = `${dh}\\text{h } ${dm.toString().padStart(2, '0')}\\text{m}${ds > 0 ? ' ' + ds + '\\text{s}' : ''}`;
  const daysNote = daysOffset !== 0 ? ` \\quad [\\text{${dayShiftDescription}}]` : '';
  const substitutionLatex = `T_{reloj} = ${startTime || '00:00'} ${opSymbol} ${durationStr} = ${targetClock}${daysNote}`;

  const formulaSteps = [
    {
      label: 'Hora de inicio',
      value: startTime || '00:00',
    },
    {
      label: `Duración operada (${isAdd ? 'Suma' : 'Resta'})`,
      value: `${isAdd ? '+' : '-'}${dh}h ${dm}m ${ds > 0 ? ds + 's' : ''}`.trim(),
    },
    {
      label: 'Cambio de calendario',
      value: dayShiftDescription,
    },
    {
      label: 'Hora de reloj resultante',
      value: targetClock,
    },
    {
      label: 'Duración en horas decimales',
      value: decimalHoursFormatted,
    },
  ];

  return {
    startTime: startTime || '00:00',
    targetClock,
    daysOffset,
    isAdd,
    dayShiftDescription,
    totalHours: targetH,
    totalMinutes: targetM,
    totalSeconds: targetS,
    totalSignedSeconds: rawTargetSeconds,
    isNegative: false,
    formattedTime: targetClock,
    digitalTime,
    decimalHours: durationDecimalHours,
    decimalHoursFormatted,
    stepDescription: `A partir de las ${startTime || '00:00'}, ${isAdd ? 'sumando' : 'restando'} ${dh}h ${dm}m resulta en las ${targetClock} (${dayShiftDescription}).`,
    isOverMidnight,
    formulaSteps,
    canonicalLatex,
    substitutionLatex,
  };
}

/**
 * Mode 3: Calculate worked hours and decimal hours for timesheets, internships, and payroll.
 * Automatically handles overnight shifts (e.g. 22:00 to 06:00).
 */
export function calculateTimesheet(
  entryTime: string,
  breakMinutes: number | '',
  exitTime: string,
  hourlyRate?: number | ''
): TimesheetResult {
  const entrySeconds = parseTimeToSeconds(entryTime || '09:00');
  const exitSeconds = parseTimeToSeconds(exitTime || '18:00');

  let grossSeconds = 0;
  let isOverMidnight = false;

  if (exitSeconds < entrySeconds) {
    // Crosses midnight (night shift)
    grossSeconds = (exitSeconds + SECONDS_PER_DAY) - entrySeconds;
    isOverMidnight = true;
  } else {
    grossSeconds = exitSeconds - entrySeconds;
    isOverMidnight = false;
  }

  const bMin = typeof breakMinutes === 'number' && !isNaN(breakMinutes) ? Math.max(0, Math.floor(breakMinutes)) : 0;
  const breakSeconds = bMin * SECONDS_PER_MINUTE;
  const netSeconds = Math.max(0, grossSeconds - breakSeconds);

  const grossH = Math.floor(grossSeconds / SECONDS_PER_HOUR);
  const grossM = Math.floor((grossSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const grossFormatted = `${grossH}h ${grossM.toString().padStart(2, '0')}m`;

  const { hours: netH, minutes: netM, seconds: netS } = secondsToSexagesimal(netSeconds);
  const netFormatted = formatSexagesimal(netH, netM, netS, false);
  const digitalTime = formatDigitalClock(netH, netM, netS, false);

  const decimalHours = secondsToDecimalHours(netSeconds);
  const decimalHoursFormatted = `${decimalHours.toFixed(2)} hrs`;

  const rate = typeof hourlyRate === 'number' && !isNaN(hourlyRate) && hourlyRate > 0 ? hourlyRate : undefined;
  const estimatedEarnings = rate ? Number((decimalHours * rate).toFixed(2)) : undefined;

  const canonicalLatex = 'T_{neto} = (T_{salida} - T_{entrada}) - T_{pausa}';
  const overnightNote = isOverMidnight ? ' \\quad [\\text{Turno noche +1 d}]' : '';
  const substitutionLatex = `T_{neto} = (${exitTime || '18:00'} - ${entryTime || '09:00'}) - ${bMin}\\text{ min} = ${netFormatted} = ${decimalHours.toFixed(2)}\\text{ hrs}${overnightNote}`;

  const formulaSteps = [
    {
      label: 'Horario registrado',
      value: `${entryTime || '09:00'} a ${exitTime || '18:00'}${isOverMidnight ? ' (Turno noche / cruza medianoche)' : ''}`,
    },
    {
      label: 'Jornada total bruta',
      value: `${grossFormatted} (${(grossSeconds / SECONDS_PER_HOUR).toFixed(2)} hrs)`,
    },
    {
      label: 'Descuento por refrigerio / almuerzo',
      value: `-${bMin} min (${(breakSeconds / SECONDS_PER_HOUR).toFixed(2)} hrs)`,
    },
    {
      label: 'Tiempo neto efectivo trabajado',
      value: netFormatted,
    },
    {
      label: 'Horas decimales computables (para planilla/prácticas)',
      value: decimalHoursFormatted,
    },
  ];

  if (estimatedEarnings !== undefined) {
    formulaSteps.push({
      label: 'Pago total estimado',
      value: `$ ${estimatedEarnings.toFixed(2)} (${decimalHours.toFixed(2)} hrs × $${rate})`,
    });
  }

  return {
    entryTime: entryTime || '09:00',
    exitTime: exitTime || '18:00',
    grossSeconds,
    grossHours: grossH,
    grossMinutes: grossM,
    grossFormatted,
    breakMinutes: bMin,
    netSeconds,
    netHours: netH,
    netMinutes: netM,
    netFormatted,
    estimatedEarnings,
    totalHours: netH,
    totalMinutes: netM,
    totalSeconds: netS,
    totalSignedSeconds: netSeconds,
    isNegative: false,
    formattedTime: netFormatted,
    digitalTime,
    decimalHours,
    decimalHoursFormatted,
    stepDescription: `Jornada de ${entryTime} a ${exitTime} con ${bMin}m de pausa = ${netFormatted} netas (${decimalHoursFormatted}).`,
    isOverMidnight,
    formulaSteps,
    canonicalLatex,
    substitutionLatex,
  };
}

/**
 * Universal calculation dispatcher adhering to Hexagonal Domain.
 */
export function calculateHours(input: TimeCalculationInput): TimeCalculationResult {
  switch (input.mode) {
    case 'durations':
      return addDurations(input.durations);
    case 'clock':
      return calculateClockTime(input.startTime, input.duration, input.isAdd);
    case 'timesheet':
      return calculateTimesheet(input.entryTime, input.breakMinutes, input.exitTime, input.hourlyRate);
  }
}

/**
 * Validates calculation input and returns error map if any.
 */
export function validateHoursInput(input: TimeCalculationInput): Record<string, string> | null {
  const errors: Record<string, string> = {};

  if (input.mode === 'durations') {
    if (!input.durations || input.durations.length === 0) {
      errors.durations = 'Debe registrar al menos una duración.';
    }
  } else if (input.mode === 'clock') {
    if (!input.startTime) {
      errors.startTime = 'La hora de inicio es requerida.';
    }
  } else if (input.mode === 'timesheet') {
    if (!input.entryTime) {
      errors.entryTime = 'La hora de entrada es requerida.';
    }
    if (!input.exitTime) {
      errors.exitTime = 'La hora de salida es requerida.';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
