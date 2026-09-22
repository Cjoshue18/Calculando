import React, { useState, useMemo, useCallback } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Share2,
  Copy,
  RotateCcw,
  Bookmark,
  Coffee,
  CheckCircle2,
  History,
  Briefcase,
  Layers,
  Moon,
  DollarSign,
  Info,
} from 'lucide-react';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { SupportModal } from '@/components/support/SupportModal';
import { hoursService } from '../adapters/LocalHoursAdapter';
import {
  OperationMode,
  TimeDuration,
  TimeCalculationInput,
  DurationsInput,
  ClockInput,
  TimesheetInput,
  ClockCalculationResult,
  TimesheetResult,
} from '../domain/types';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLocalStorageHistory } from '@/core/hooks/useLocalStorageHistory';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useLanguage } from '@/context/LanguageContext';

const defaultDurations: TimeDuration[] = [
  { id: '1', hours: 3, minutes: 45, seconds: 0, isNegative: false, label: 'Sesión mañana' },
  { id: '2', hours: 2, minutes: 30, seconds: 0, isNegative: false, label: 'Sesión tarde' },
  { id: '3', hours: 0, minutes: 45, seconds: 0, isNegative: true, label: 'Pausa café' },
];

export const HoursCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { getInitialState } = useUrlStateSync<Record<string, unknown>>();
  const { history, addHistoryItem, clearHistory } = useLocalStorageHistory<Record<string, unknown>>('hours-adder');
  const { copy } = useCopyToClipboard();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Active Mode: durations | clock | timesheet
  const [activeMode, setActiveMode] = useState<OperationMode>(() => {
    const initial = getInitialState();
    return (initial?.mode as OperationMode) || 'durations';
  });

  // State for Mode 1: Durations
  const [durations, setDurations] = useState<TimeDuration[]>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'durations' && Array.isArray(initial.durations)) {
      return initial.durations as TimeDuration[];
    }
    return defaultDurations;
  });

  // State for Mode 2: Clock
  const [clockStartTime, setClockStartTime] = useState<string>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'clock' && typeof initial.startTime === 'string') {
      return initial.startTime;
    }
    return '14:30';
  });
  const [clockDurationHours, setClockDurationHours] = useState<number | ''>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'clock' && initial.durationHours !== undefined) {
      return initial.durationHours as number | '';
    }
    return 3;
  });
  const [clockDurationMinutes, setClockDurationMinutes] = useState<number | ''>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'clock' && initial.durationMinutes !== undefined) {
      return initial.durationMinutes as number | '';
    }
    return 15;
  });
  const [clockDurationSeconds, setClockDurationSeconds] = useState<number | ''>(0);
  const [clockIsAdd, setClockIsAdd] = useState<boolean>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'clock' && typeof initial.isAdd === 'boolean') {
      return initial.isAdd;
    }
    return true;
  });

  // State for Mode 3: Timesheet
  const [timesheetEntry, setTimesheetEntry] = useState<string>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'timesheet' && typeof initial.entryTime === 'string') {
      return initial.entryTime;
    }
    return '09:00';
  });
  const [timesheetExit, setTimesheetExit] = useState<string>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'timesheet' && typeof initial.exitTime === 'string') {
      return initial.exitTime;
    }
    return '18:00';
  });
  const [timesheetBreak, setTimesheetBreak] = useState<number | ''>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'timesheet' && initial.breakMinutes !== undefined) {
      return initial.breakMinutes as number | '';
    }
    return 60;
  });
  const [timesheetHourlyRate, setTimesheetHourlyRate] = useState<number | ''>(() => {
    const initial = getInitialState();
    if (initial?.mode === 'timesheet' && initial.hourlyRate !== undefined) {
      return initial.hourlyRate as number | '';
    }
    return '';
  });

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  }, []);

  // Build calculation input based on active mode
  const currentCalculationInput: TimeCalculationInput = useMemo(() => {
    if (activeMode === 'durations') {
      const input: DurationsInput = {
        mode: 'durations',
        durations,
      };
      return input;
    }
    if (activeMode === 'clock') {
      const input: ClockInput = {
        mode: 'clock',
        startTime: clockStartTime,
        duration: {
          hours: clockDurationHours,
          minutes: clockDurationMinutes,
          seconds: clockDurationSeconds,
        },
        isAdd: clockIsAdd,
      };
      return input;
    }
    const input: TimesheetInput = {
      mode: 'timesheet',
      entryTime: timesheetEntry,
      exitTime: timesheetExit,
      breakMinutes: timesheetBreak,
      hourlyRate: timesheetHourlyRate,
    };
    return input;
  }, [
    activeMode,
    durations,
    clockStartTime,
    clockDurationHours,
    clockDurationMinutes,
    clockDurationSeconds,
    clockIsAdd,
    timesheetEntry,
    timesheetExit,
    timesheetBreak,
    timesheetHourlyRate,
  ]);

  // Real-time calculation using Hexagonal Service Adapter
  const calculationResult = useMemo(() => {
    return hoursService.calculate(currentCalculationInput);
  }, [currentCalculationInput]);

  // Handlers for Mode 1: Durations
  const handleAddDurationRow = () => {
    const newId = Date.now().toString();
    setDurations((prev) => [
      ...prev,
      { id: newId, hours: '', minutes: '', seconds: '', isNegative: false, label: '' },
    ]);
  };

  const handleQuickAddChip = (addH: number, addM: number) => {
    const newId = Date.now().toString();
    const label = `${addH > 0 ? addH + 'h ' : ''}${addM > 0 ? addM + 'm' : ''}`.trim();
    setDurations((prev) => [
      ...prev,
      { id: newId, hours: addH, minutes: addM, seconds: 0, isNegative: false, label },
    ]);
    triggerToast(`+${label} agregado`);
  };

  const handleRemoveDurationRow = (id: string) => {
    if (durations.length <= 1) return;
    setDurations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateDurationRow = (
    id: string,
    field: keyof TimeDuration,
    value: string | number | boolean
  ) => {
    setDurations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'isNegative') {
          return { ...item, isNegative: Boolean(value) };
        }
        if (field === 'hours' || field === 'minutes' || field === 'seconds') {
          if (value === '') return { ...item, [field]: '' };
          const num = Number(value);
          return { ...item, [field]: isNaN(num) ? '' : Math.max(0, Math.floor(num)) };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const handleClearDurations = () => {
    setDurations([
      { id: Date.now().toString(), hours: '', minutes: '', seconds: '', isNegative: false, label: '' },
    ]);
    triggerToast('Filas reiniciadas');
  };

  // Handlers for Mode 2: Clock
  const handleSetClockToNow = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setClockStartTime(`${h}:${m}`);
    triggerToast(`${language === 'en' ? 'Set to current time' : 'Ajustado a hora actual'}: ${h}:${m}`);
  };

  const handleClockQuickChip = (addH: number, addM: number) => {
    setClockDurationHours(addH);
    setClockDurationMinutes(addM);
    setClockDurationSeconds(0);
  };

  // Handlers for Mode 3: Timesheet
  const handleTimesheetPreset = (entry: string, exit: string, breakMin: number) => {
    setTimesheetEntry(entry);
    setTimesheetExit(exit);
    setTimesheetBreak(breakMin);
    triggerToast(language === 'en' ? 'Preset applied' : 'Plantilla aplicada');
  };

  // Reset all
  const handleReset = () => {
    if (activeMode === 'durations') {
      setDurations(defaultDurations);
    } else if (activeMode === 'clock') {
      setClockStartTime('14:30');
      setClockDurationHours(3);
      setClockDurationMinutes(15);
      setClockDurationSeconds(0);
      setClockIsAdd(true);
    } else {
      setTimesheetEntry('09:00');
      setTimesheetExit('18:00');
      setTimesheetBreak(60);
      setTimesheetHourlyRate('');
    }
    triggerToast(t('hours.resetSuccess'));
  };

  // Share tool link
  const handleShareUrl = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    await copy(cleanUrl);
    triggerToast(t('common.copiedUrl'));
  };

  // Copy structured summary for WhatsApp / email / timesheet logs
  const handleCopySummary = async () => {
    let summaryText = '';
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;

    if (activeMode === 'durations') {
      summaryText = [
        language === 'en' ? '*Calculando — Time Durations Sum*' : '*Calculando — Suma de Duraciones de Tiempo*',
        `${language === 'en' ? 'Total Result' : 'Resultado Total'}: *${calculationResult.formattedTime}*`,
        `${language === 'en' ? 'Decimal Hours' : 'Horas Decimales'}: *${calculationResult.decimalHoursFormatted}*`,
        `${language === 'en' ? 'Total Seconds' : 'Total Segundos'}: ${calculationResult.totalSignedSeconds} s`,
        `${language === 'en' ? 'Calculate yours' : 'Calcula el tuyo'}: ${cleanUrl}`,
      ].join('\n');
    } else if (activeMode === 'clock') {
      const clockRes = calculationResult as ClockCalculationResult;
      summaryText = [
        language === 'en' ? '*Calculando — Clock Finish Time*' : '*Calculando — Hora de Reloj*',
        `${language === 'en' ? 'Start Time' : 'Hora de Inicio'}: ${clockRes.startTime}`,
        `${language === 'en' ? 'Operation' : 'Operación'}: ${clockRes.isAdd ? '+' : '-'}${clockDurationHours}h ${clockDurationMinutes}m`,
        `*${language === 'en' ? 'Target Time' : 'Hora Final'}: ${clockRes.targetClock}* (${clockRes.dayShiftDescription})`,
        `${language === 'en' ? 'Decimal Duration' : 'Duración Decimal'}: ${clockRes.decimalHoursFormatted}`,
        `${language === 'en' ? 'Calculate yours' : 'Calcula el tuyo'}: ${cleanUrl}`,
      ].join('\n');
    } else {
      const tsRes = calculationResult as TimesheetResult;
      summaryText = [
        language === 'en' ? '*Calculando — Work Timesheet Log*' : '*Calculando — Cómputo de Jornada Laboral*',
        `${language === 'en' ? 'Entry Time' : 'Hora de Entrada'}: ${tsRes.entryTime}`,
        `${language === 'en' ? 'Exit Time' : 'Hora de Salida'}: ${tsRes.exitTime}`,
        `${language === 'en' ? 'Break / Lunch' : 'Refrigerio/Pausa'}: ${tsRes.breakMinutes} min`,
        `*${language === 'en' ? 'Net Worked Hours' : 'Horas Netas Trabajadas'}: ${tsRes.netFormatted}*`,
        `*${language === 'en' ? 'Decimal Hours' : 'Horas Decimales (Planilla)'}: ${tsRes.decimalHoursFormatted}*`,
        tsRes.estimatedEarnings ? `${language === 'en' ? 'Estimated Earnings' : 'Pago Estimado'}: $${tsRes.estimatedEarnings.toFixed(2)}` : '',
        `${language === 'en' ? 'Calculate yours' : 'Calcula el tuyo'}: ${cleanUrl}`,
      ].filter(Boolean).join('\n');
    }

    await copy(summaryText);
    triggerToast(t('hours.summaryCopied'));
  };

  // Save to history
  const handleSaveToHistory = () => {
    let summary = '';
    if (activeMode === 'durations') {
      summary = `${durations.length} ${language === 'en' ? 'durations' : 'duraciones'} = ${calculationResult.formattedTime} (${calculationResult.decimalHoursFormatted})`;
    } else if (activeMode === 'clock') {
      const clockRes = calculationResult as ClockCalculationResult;
      summary = `${clockRes.startTime} ${clockRes.isAdd ? '+' : '-'} ${clockDurationHours}h ${clockDurationMinutes}m = ${clockRes.targetClock}`;
    } else {
      const tsRes = calculationResult as TimesheetResult;
      summary = `${tsRes.entryTime} - ${tsRes.exitTime} (-${tsRes.breakMinutes}m) = ${tsRes.netFormatted} (${tsRes.decimalHoursFormatted})`;
    }

    const historyData: Record<string, unknown> = {
      mode: activeMode,
      ...(activeMode === 'durations' ? { durations } : {}),
      ...(activeMode === 'clock'
        ? {
            startTime: clockStartTime,
            durationHours: clockDurationHours,
            durationMinutes: clockDurationMinutes,
            isAdd: clockIsAdd,
          }
        : {}),
      ...(activeMode === 'timesheet'
        ? {
            entryTime: timesheetEntry,
            exitTime: timesheetExit,
            breakMinutes: timesheetBreak,
            hourlyRate: timesheetHourlyRate,
          }
        : {}),
    };

    addHistoryItem(summary, historyData);
    triggerToast(language === 'en' ? 'Saved to history' : 'Guardado en historial');
  };

  // Restore history item
  const handleRestoreHistory = (data: Record<string, unknown>) => {
    if (data.mode === 'durations' && Array.isArray(data.durations)) {
      setActiveMode('durations');
      setDurations(data.durations as TimeDuration[]);
    } else if (data.mode === 'clock') {
      setActiveMode('clock');
      if (typeof data.startTime === 'string') setClockStartTime(data.startTime);
      if (data.durationHours !== undefined) setClockDurationHours(data.durationHours as number | '');
      if (data.durationMinutes !== undefined) setClockDurationMinutes(data.durationMinutes as number | '');
      if (typeof data.isAdd === 'boolean') setClockIsAdd(data.isAdd);
    } else if (data.mode === 'timesheet') {
      setActiveMode('timesheet');
      if (typeof data.entryTime === 'string') setTimesheetEntry(data.entryTime);
      if (typeof data.exitTime === 'string') setTimesheetExit(data.exitTime);
      if (data.breakMinutes !== undefined) setTimesheetBreak(data.breakMinutes as number | '');
      if (data.hourlyRate !== undefined) setTimesheetHourlyRate(data.hourlyRate as number | '');
    }
    triggerToast(language === 'en' ? 'Restored from history' : 'Restaurado desde historial');
  };

  return (
    <div className="space-y-8">
      {/* ══════════════════════════════════════════════════════
          1. TOOL HEADER (CAL.COM MONOCHROME UTILITY)
         ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('hours.pageTitle')}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {t('hours.pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleShareUrl}
            title={t('common.share')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#5d95b3]" />
            <span>{t('common.share')}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            title={t('hours.reset')}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. MODE SWITCHER TABS (SOLID BACKGROUNDS, NO GLASSMORPHISM)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveMode('durations')}
          className={`px-3 py-2 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'durations'
              ? 'bg-[#234968] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('hours.tabDurations')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('clock')}
          className={`px-3 py-2 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'clock'
              ? 'bg-[#234968] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('hours.tabClock')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('timesheet')}
          className={`px-3 py-2 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'timesheet'
              ? 'bg-[#234968] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t('hours.tabTimesheet')}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          3. TWO-COLUMN WORKSPACE
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Interactive Inputs (~58% / 7 cols) ── */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 shadow-cal-card space-y-6">
          
          {/* TAB 1: DURATIONS */}
          {activeMode === 'durations' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    {t('hours.durationsTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t('hours.durationsSubtitle')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearDurations}
                  className="text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {t('hours.clearDurations')}
                </button>
              </div>

              {/* Quick Adjustment Chips */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  {t('hours.quickAdd')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { h: 0, m: 15, label: '+15m' },
                    { h: 0, m: 30, label: '+30m' },
                    { h: 0, m: 45, label: '+45m' },
                    { h: 1, m: 0, label: '+1h' },
                    { h: 1, m: 30, label: '+1h 30m' },
                    { h: 2, m: 0, label: '+2h' },
                    { h: 4, m: 0, label: '+4h' },
                    { h: 8, m: 0, label: '+8h' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleQuickAddChip(chip.h, chip.m)}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 hover:bg-[#234968] hover:text-white dark:hover:bg-[#5d95b3] dark:hover:text-zinc-950 transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Rows */}
              <div className="space-y-2.5">
                {durations.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md grid grid-cols-12 gap-2 items-center hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    {/* Sign Toggle Button (+ / -) */}
                    <div className="col-span-2 sm:col-span-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateDurationRow(item.id, 'isNegative', !item.isNegative)}
                        title={item.isNegative ? 'Restar duración' : 'Sumar duración'}
                        className={`w-full py-1.5 rounded-md font-mono text-xs font-bold border transition-colors cursor-pointer text-center ${
                          item.isNegative
                            ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
                        }`}
                      >
                        {item.isNegative ? '−' : '+'}
                      </button>
                    </div>

                    {/* Hours Input */}
                    <div className="col-span-5 sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={item.hours}
                          onChange={(e) => handleUpdateDurationRow(item.id, 'hours', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                        />
                        <span className="absolute right-2.5 top-1.5 text-xs font-mono text-slate-400 pointer-events-none">
                          h
                        </span>
                      </div>
                    </div>

                    {/* Minutes Input */}
                    <div className="col-span-5 sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={item.minutes}
                          onChange={(e) => handleUpdateDurationRow(item.id, 'minutes', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                        />
                        <span className="absolute right-2.5 top-1.5 text-xs font-mono text-slate-400 pointer-events-none">
                          m
                        </span>
                      </div>
                    </div>

                    {/* Optional Label */}
                    <div className="col-span-10 sm:col-span-4">
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => handleUpdateDurationRow(item.id, 'label', e.target.value)}
                        placeholder={`${t('hours.labelPlaceholder')} #${index + 1}`}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                      />
                    </div>

                    {/* Remove Row Button */}
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveDurationRow(item.id)}
                        disabled={durations.length <= 1}
                        title={t('finalGrade.remove')}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add row button */}
              <button
                type="button"
                onClick={handleAddDurationRow}
                className="w-full py-2 px-3 border border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#5d95b3] dark:hover:border-[#5d95b3] rounded-md text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('hours.addDurationRow')}</span>
              </button>
            </div>
          )}

          {/* TAB 2: CLOCK TIME */}
          {activeMode === 'clock' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {t('hours.clockTitle')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {t('hours.clockSubtitle')}
                </p>
              </div>

              {/* Start Clock Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    {t('hours.startTime')}
                  </label>
                  <button
                    type="button"
                    onClick={handleSetClockToNow}
                    className="text-xs font-mono text-[#5d95b3] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    <span>{t('hours.currentTime')}</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={clockStartTime}
                    onChange={(e) => setClockStartTime(e.target.value)}
                    className="px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['08:00', '09:00', '13:00', '18:00', '22:00'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setClockStartTime(preset)}
                        className={`px-2 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                          clockStartTime === preset
                            ? 'bg-[#234968] text-white border-[#234968]'
                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operation Toggle (+ / -) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {t('hours.operation')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClockIsAdd(true)}
                    className={`py-2 px-3 text-xs font-bold rounded-md border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      clockIsAdd
                        ? 'bg-[#234968] text-white border-[#234968]'
                        : 'bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>+</span>
                    <span>{t('hours.addTime')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setClockIsAdd(false)}
                    className={`py-2 px-3 text-xs font-bold rounded-md border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      !clockIsAdd
                        ? 'bg-[#234968] text-white border-[#234968]'
                        : 'bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>−</span>
                    <span>{t('hours.subtractTime')}</span>
                  </button>
                </div>
              </div>

              {/* Duration Inputs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {t('hours.durationToOperate')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={clockDurationHours}
                      onChange={(e) => setClockDurationHours(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-400 pointer-events-none">
                      {t('hours.hoursPlaceholder')}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={clockDurationMinutes}
                      onChange={(e) => setClockDurationMinutes(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-400 pointer-events-none">
                      {t('hours.minutesPlaceholder')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Adjustment Chips */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  {t('hours.quickAdd')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { h: 0, m: 15, label: '15m' },
                    { h: 0, m: 30, label: '30m' },
                    { h: 0, m: 45, label: '45m' },
                    { h: 1, m: 0, label: '1h' },
                    { h: 1, m: 30, label: '1h 30m' },
                    { h: 2, m: 0, label: '2h' },
                    { h: 4, m: 0, label: '4h' },
                    { h: 8, m: 0, label: '8h' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleClockQuickChip(chip.h, chip.m)}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 hover:bg-[#234968] hover:text-white dark:hover:bg-[#5d95b3] dark:hover:text-zinc-950 transition-colors cursor-pointer"
                    >
                      {clockIsAdd ? `+${chip.label}` : `-${chip.label}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WORK TIMESHEET */}
          {activeMode === 'timesheet' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {t('hours.timesheetTitle')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {t('hours.timesheetSubtitle')}
                </p>
              </div>

              {/* Standard presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {language === 'en' ? 'Shift Presets:' : 'Plantillas de Turno:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTimesheetPreset('09:00', '18:00', 60)}
                    className="p-2 text-left rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:border-[#5d95b3] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {language === 'en' ? 'Standard 8h' : 'Jornada 8h'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">09:00 - 18:00 (1h break)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTimesheetPreset('08:00', '14:00', 0)}
                    className="p-2 text-left rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:border-[#5d95b3] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {language === 'en' ? 'Half-day 6h' : 'Media Jornada 6h'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">08:00 - 14:00 (0 pause)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTimesheetPreset('22:00', '06:00', 30)}
                    className="p-2 text-left rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:border-[#5d95b3] transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                      <Moon className="w-3 h-3 text-indigo-400" />
                      <span>{language === 'en' ? 'Night Shift' : 'Turno Noche'}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">22:00 - 06:00 (30m break)</div>
                  </button>
                </div>
              </div>

              {/* Entry & Exit times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    {t('hours.entryTime')}
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={timesheetEntry}
                      onChange={(e) => setTimesheetEntry(e.target.value)}
                      className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    {t('hours.exitTime')}
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={timesheetExit}
                      onChange={(e) => setTimesheetExit(e.target.value)}
                      className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                    />
                  </div>
                </div>
              </div>

              {/* Break / Lunch */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {t('hours.breakTime')}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-36">
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={timesheetBreak}
                      onChange={(e) => setTimesheetBreak(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="60"
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-400 pointer-events-none">
                      min
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[0, 30, 45, 60, 90].map((minVal) => (
                      <button
                        key={minVal}
                        type="button"
                        onClick={() => setTimesheetBreak(minVal)}
                        className={`px-2.5 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                          timesheetBreak === minVal
                            ? 'bg-[#234968] text-white border-[#234968] font-bold'
                            : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                        }`}
                      >
                        {minVal === 0 ? (language === 'en' ? 'None' : '0 min') : `${minVal}m`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Hourly Rate */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('hours.hourlyRate')}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    {language === 'en' ? 'Calculates expected earnings for freelance or work shift.' : 'Calcula el pago estimado según las horas decimales computadas.'}
                  </div>
                </div>
                <div className="relative w-full sm:w-32">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={timesheetHourlyRate}
                    onChange={(e) => setTimesheetHourlyRate(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs font-mono text-slate-400 pointer-events-none">
                    $/h
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Big Sticky Result Card (~42% / 5 cols) ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-[#5d95b3] rounded-lg p-6 shadow-cal-card space-y-5">
            
            {/* Status Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                {t('hours.results')}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#234968] text-white">
                {activeMode === 'durations' && t('hours.totalDuration')}
                {activeMode === 'clock' && t('hours.targetClockTime')}
                {activeMode === 'timesheet' && t('hours.netWorkHours')}
              </span>
            </div>

            {/* Big Monospace Number */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {activeMode === 'durations' && (language === 'en' ? 'Total sexagesimal time:' : 'Tiempo sexagesimal total:')}
                {activeMode === 'clock' && (language === 'en' ? 'Resulting clock time:' : 'Hora de reloj final:')}
                {activeMode === 'timesheet' && (language === 'en' ? 'Net effective worked time:' : 'Jornada neta computada:')}
              </div>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {calculationResult.formattedTime}
                </span>
                <span className="text-sm font-mono font-medium text-slate-400 dark:text-zinc-500">
                  {calculationResult.digitalTime}
                </span>
              </div>

              {/* Decimal Hours Badge */}
              <div className="mt-3 flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-md font-mono text-sm font-bold shadow-2xs">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                    {t('hours.decimalHoursBadge')}:
                  </span>
                  <span>= {calculationResult.decimalHoursFormatted}</span>
                </div>
              </div>

              {/* Midnight indicator badge if overnight */}
              {calculationResult.isOverMidnight && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 rounded-md text-xs font-medium">
                  <Moon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {activeMode === 'clock'
                      ? (calculationResult as ClockCalculationResult).dayShiftDescription
                      : t('hours.overnightShift')}
                  </span>
                </div>
              )}
            </div>

            {/* Secondary Metric Breakdown Box */}
            <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-zinc-800">
              {activeMode === 'durations' && (
                <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{language === 'en' ? 'Item count' : 'Cantidad de registros'}:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{durations.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{language === 'en' ? 'Raw seconds' : 'Segundos totales'}:</span>
                    <span className="font-mono font-bold text-[#234968] dark:text-[#5d95b3]">{calculationResult.totalSignedSeconds.toLocaleString('es-PE')} s</span>
                  </div>
                </div>
              )}

              {activeMode === 'clock' && (
                <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{t('hours.startTime')}:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{(calculationResult as ClockCalculationResult).startTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{t('hours.durationToOperate')}:</span>
                    <span className="font-mono font-bold text-[#234968] dark:text-[#5d95b3]">
                      {(calculationResult as ClockCalculationResult).isAdd ? '+' : '-'}{clockDurationHours}h {clockDurationMinutes}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{language === 'en' ? 'Calendar change' : 'Cambio de calendario'}:</span>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      {(calculationResult as ClockCalculationResult).dayShiftDescription}
                    </span>
                  </div>
                </div>
              )}

              {activeMode === 'timesheet' && (
                <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{t('hours.grossHours')}:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                      {(calculationResult as TimesheetResult).grossFormatted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">{t('hours.breakDeducted')}:</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      -{(calculationResult as TimesheetResult).breakMinutes} min
                    </span>
                  </div>
                  {(calculationResult as TimesheetResult).estimatedEarnings !== undefined && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-zinc-800">
                      <span className="text-slate-500 dark:text-zinc-400">{t('hours.estimatedPay')}:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ${(calculationResult as TimesheetResult).estimatedEarnings?.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full py-2.5 px-4 bg-[#234968] hover:bg-[#1a374e] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t('hours.copySummary')}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShareUrl}
                  className="flex-1 py-2 px-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5d95b3]" />
                  <span>{t('common.share')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  title={language === 'en' ? 'Save calculation' : 'Guardar en historial'}
                  className="px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#5d95b3]" />
                  <span>{language === 'en' ? 'Save' : 'Guardar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          4. SEXAGESIMAL CALCULATION BREAKDOWN (FULL WIDTH BELOW)
         ══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 shadow-cal-card space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            {language === 'en' ? 'Mathematical Accuracy' : 'Transparencia Sexagesimal'}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 {t('hours.formulaTitle')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {t('hours.formulaSubtitle')}
          </p>
        </div>

        {/* Canonical Equation */}
        {calculationResult.canonicalLatex && (
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
              {language === 'en' ? 'Formal Equation' : 'Ecuación Canónica'}
            </div>
            <MathView
              math={calculationResult.canonicalLatex}
              className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto"
            />
          </div>
        )}

        {/* Substitution LaTeX */}
        {calculationResult.substitutionLatex && (
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
              {language === 'en' ? 'Substitution with your Values' : 'Sustitución con tus Valores Actuales'}
            </div>
            <MathView
              math={calculationResult.substitutionLatex}
              className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto"
            />
          </div>
        )}

        {/* Step-by-Step Breakdown */}
        {calculationResult.formulaSteps && calculationResult.formulaSteps.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {language === 'en' ? 'Step-by-Step Breakdown:' : 'Desglose Paso a Paso:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-slate-600 dark:text-zinc-400">
              {calculationResult.formulaSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-md border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
                >
                  <span className="text-slate-500">{step.label}:</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{step.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Callout: Why Decimal Hours */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-md flex items-start gap-3 text-xs text-slate-600 dark:text-zinc-300">
          <Info className="w-4 h-4 shrink-0 text-[#5d95b3] mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">
              {t('hours.decimalExplanationTitle')}
            </div>
            <div className="leading-relaxed">
              {t('hours.decimalExplanation')}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          5. COMMUNITY SUPPORT & BOOKMARK SECTION
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Bookmark */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
              <span className="text-amber-500">⭐</span>
              <span>{language === 'en' ? 'Add to Bookmarks' : 'Agrégala a tus marcadores'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {language === 'en' ? (
                <>Save this page with <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> to have it ready whenever you log work hours.</>
              ) : (
                <>Guarda esta página con <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> para tenerla siempre a mano al registrar tus horas de trabajo o prácticas.</>
              )}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                alert(language === 'en' ? 'Press Ctrl + D (Cmd + D on Mac) to bookmark this calculator' : 'Presiona Ctrl + D (Cmd + D en Mac) para guardar esta calculadora en tus marcadores');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#5d95b3]" />
              <span>{language === 'en' ? 'Bookmark Tool' : 'Guardar en Marcadores'}</span>
            </button>
          </div>
        </div>

        {/* Card B: Support with Coffee / Yape */}
        <div className="p-5 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#234968] dark:text-[#5d95b3] mb-1">
              <Coffee className="w-4 h-4" />
              <span>{language === 'en' ? 'Found this useful?' : '¿Te fue de utilidad?'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              {language === 'en' ? 'Calculando is a fast, 100% private math utility suite. Your support helps keep it free and independent.' : 'Calculando es una suite de cálculo rápido y privado. Tu apoyo voluntario contribuye al mantenimiento del servicio sin anuncios invasivos.'}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className="px-4 py-2 bg-[#234968] hover:bg-[#1a374e] text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{t('common.support')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          6. RECENT CALCULATIONS HISTORY DRAWER
         ══════════════════════════════════════════════════════ */}
      {history.length > 0 && (
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <History className="w-4 h-4 text-[#5d95b3]" />
              <span>{t('hours.historyTitle')}</span>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="text-[11px] text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              {t('common.clearHistory')}
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRestoreHistory(item.data as Record<string, unknown>)}
                className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md flex items-center justify-between text-xs cursor-pointer hover:border-[#5d95b3] dark:hover:border-[#5d95b3] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-800 dark:text-zinc-200 font-semibold group-hover:text-[#234968] dark:group-hover:text-[#5d95b3]">
                    {item.summary}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Toast message={toastMessage} isVisible={showToast} />
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
};
