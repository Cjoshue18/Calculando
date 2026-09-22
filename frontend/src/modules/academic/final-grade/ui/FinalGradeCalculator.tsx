import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Share2, 
  Copy, 
  RotateCcw, 
  AlertTriangle,
  History,
  Info,
  CheckCircle2,
  Bookmark,
  Coffee
} from 'lucide-react';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { SupportModal } from '@/components/support/SupportModal';
import { finalGradeService } from '../adapters/LocalFinalGradeAdapter';
import { FinalGradeInput, Evaluation } from '../domain/types';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLocalStorageHistory } from '@/core/hooks/useLocalStorageHistory';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useLanguage } from '@/context/LanguageContext';

const defaultEvaluations: Evaluation[] = [
  { id: '1', name: 'Examen Parcial', score: 12, weight: 30 },
  { id: '2', name: 'Promedio de Prácticas', score: 14, weight: 30 },
];

export const FinalGradeCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { getInitialState } = useUrlStateSync<FinalGradeInput>();
  const { history, addHistoryItem, clearHistory } = useLocalStorageHistory<FinalGradeInput>('final-grade');
  const { copy } = useCopyToClipboard();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Initialize state from URL if shared, otherwise default
  const [courseName, setCourseName] = useState(() => (language === 'en' ? 'My Subject' : 'Mi Asignatura'));
  const [maxScale, setMaxScale] = useState<number>(() => {
    const initial = getInitialState();
    return initial?.maxScale && initial.maxScale > 0 ? initial.maxScale : 20;
  });
  const [passingThreshold, setPassingThreshold] = useState<number>(() => {
    const initial = getInitialState();
    return initial?.passingThreshold ?? 10.5;
  });
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const initial = getInitialState();
    return initial?.evaluations ?? defaultEvaluations;
  });
  const [finalExamWeight, setFinalExamWeight] = useState<number | ''>(() => {
    const initial = getInitialState();
    return initial?.finalExamWeight !== undefined ? initial.finalExamWeight : 40;
  });

  // Current calculation input
  const currentInput: FinalGradeInput = useMemo(() => ({
    evaluations,
    finalExamWeight,
    passingThreshold,
    maxScale,
  }), [evaluations, finalExamWeight, passingThreshold, maxScale]);

  // Calculate in real-time
  const result = useMemo(() => {
    return finalGradeService.calculate(currentInput);
  }, [currentInput]);

  // Handle Max Scale change
  const handleScaleChange = (newScale: number) => {
    if (newScale <= 0) return;
    setMaxScale(newScale);
    // If current passing threshold exceeds new max scale, adjust proportionally
    if (passingThreshold > newScale) {
      setPassingThreshold(Number((newScale * 0.55).toFixed(1)));
    }
    // Also adjust evaluation scores if they exceed newScale
    setEvaluations(prev =>
      prev.map(e => ({
        ...e,
        score: typeof e.score === 'number' && e.score > newScale ? newScale : e.score,
      }))
    );
  };

  // Dynamic threshold presets based on active max scale
  const thresholdPresets = useMemo(() => {
    if (maxScale === 20) return [10.5, 11, 12];
    if (maxScale === 10) return [5.0, 5.5, 6.0];
    if (maxScale === 5) return [3.0, 3.5];
    if (maxScale === 100) return [60, 70, 75];
    return [
      Number((maxScale * 0.5).toFixed(1)),
      Number((maxScale * 0.6).toFixed(1)),
    ];
  }, [maxScale]);

  // Handlers for dynamic evaluations
  const handleAddEvaluation = () => {
    const newId = Date.now().toString();
    setEvaluations(prev => [
      ...prev,
      { id: newId, name: `Evaluación ${prev.length + 1}`, score: '', weight: '' }
    ]);
  };

  const handleRemoveEvaluation = (id: string) => {
    if (evaluations.length <= 1) return;
    setEvaluations(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEvaluation = (id: string, field: keyof Evaluation, value: string | number) => {
    setEvaluations(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        if (field === 'score') {
          if (value === '') return { ...e, score: '' };
          const num = Number(value);
          return { ...e, score: num > maxScale ? maxScale : num };
        }
        if (field === 'weight') {
          return { ...e, weight: value === '' ? '' : Number(value) };
        }
        return { ...e, [field]: value };
      })
    );
  };

  const handleReset = () => {
    setCourseName('Mi Asignatura');
    setMaxScale(20);
    setPassingThreshold(10.5);
    setEvaluations(defaultEvaluations);
    setFinalExamWeight(40);
    triggerToast('Valores restaurados por defecto');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleSaveToHistory = () => {
    const summary = `${courseName}: ${language === 'en' ? 'Requires' : 'Requiere'} ${result.requiredFinalScore}/${maxScale} ${language === 'en' ? 'on final (Weight' : 'en final (Peso'} ${finalExamWeight}%)`;
    addHistoryItem(summary, currentInput);
    triggerToast(language === 'en' ? 'Calculation saved to history' : 'Cálculo guardado en historial');
  };

  const handleShareUrl = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    await copy(cleanUrl);
    triggerToast(language === 'en' ? 'Tool link copied to clipboard' : 'Enlace de la herramienta copiado al portapapeles');
  };

  const statusMessage = useMemo(() => {
    if (result.status === 'approved') return t('finalGrade.statusApproved');
    if (result.status === 'feasible') return t('finalGrade.statusFeasible');
    if (result.status === 'challenging') return t('finalGrade.statusChallenging');
    return language === 'en'
      ? `Mathematically unattainable with the regular final exam (requires ${result.requiredFinalScore} out of ${maxScale}). Consider preparing for makeup or substitute exam.`
      : `Matemáticamente inalcanzable con el examen final ordinario (requiere ${result.requiredFinalScore} sobre ${maxScale}). Considera preparar el examen sustitutorio o aplazados.`;
  }, [result.status, result.requiredFinalScore, maxScale, language, t]);

  const handleCopyWhatsappSummary = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    const text = [
      language === 'en' ? '*Calculando - Required Final Exam Score*' : '*Calculando - Nota Requerida en Examen Final*',
      `${language === 'en' ? 'Course' : 'Curso'}: ${courseName}`,
      `${language === 'en' ? 'Scale' : 'Escala máxima'}: ${maxScale}`,
      `${language === 'en' ? 'Points accumulated' : 'Puntos acumulados'}: ${result.accumulatedPoints} pts`,
      `${language === 'en' ? 'Final weight' : 'Peso del final'}: ${finalExamWeight}%`,
      `*${language === 'en' ? 'Required score' : 'Nota requerida'}: ${result.requiredFinalScore} / ${maxScale}*`,
      `${language === 'en' ? 'Status' : 'Estado'}: ${statusMessage}`,
      `${language === 'en' ? 'Calculate yours' : 'Calcula el tuyo'}: ${cleanUrl}`,
    ].join('\n');
    await copy(text);
    triggerToast(t('finalGrade.summaryCopied'));
  };

  const handleRestoreHistoryItem = (item: FinalGradeInput) => {
    if (item.maxScale) setMaxScale(item.maxScale);
    setPassingThreshold(item.passingThreshold);
    setEvaluations(item.evaluations);
    setFinalExamWeight(item.finalExamWeight);
    triggerToast(language === 'en' ? 'Calculation restored from history' : 'Cálculo restaurado desde historial');
  };

  // Status visual styles
  const statusStyles = {
    approved: {
      badge: 'bg-emerald-600 text-white',
      accentColor: 'text-emerald-700 dark:text-emerald-400',
      label: t('finalGrade.statusApprovedBadge'),
    },
    feasible: {
      badge: 'bg-[#234968] text-white',
      accentColor: 'text-[#234968] dark:text-[#5d95b3]',
      label: t('finalGrade.statusFeasibleBadge'),
    },
    challenging: {
      badge: 'bg-amber-600 text-white',
      accentColor: 'text-amber-700 dark:text-amber-400',
      label: t('finalGrade.statusChallengingBadge'),
    },
    impossible: {
      badge: 'bg-rose-600 text-white',
      accentColor: 'text-rose-700 dark:text-rose-400',
      label: t('finalGrade.statusImpossibleBadge'),
    },
  }[result.status];

  return (
    <div className="space-y-8">
      {/* ══════════════════════════════════════════════════════
          1. TOOL HEADER (CAL.COM MONOCHROME UTILITY)
         ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('finalGrade.pageTitle')}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {t('finalGrade.pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleShareUrl}
            title={t('finalGrade.shareTitle')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#5d95b3]" />
            <span>{t('finalGrade.shareBtn')}</span>
          </button>
          <button
            onClick={handleReset}
            title={t('finalGrade.resetTitle')}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-full transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. TWO-COLUMN WORKSPACE (CAL.COM 12px CARDS, 8px INPUTS)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Interactive Input Card (~58% / 7 cols) ── */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-cal-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {t('finalGrade.inputTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {t('finalGrade.inputSubtitle')}
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
              {language === 'en' ? 'Current weight:' : 'Ponderación actual:'} <strong className="text-slate-900 dark:text-zinc-200">{result.accumulatedWeight}%</strong>
            </span>
          </div>

          {/* Scale & General Settings */}
          <div className="space-y-4">
            {/* Top row: Course Name and Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  {language === 'en' ? 'Course Name (Optional)' : 'Nombre de Asignatura (Opcional)'}
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Calculus II, Finance...' : 'Ej. Cálculo II, Finanzas...'}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 transition-all"
                />
              </div>

              {/* Dynamic Max Scale Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    {language === 'en' ? 'Maximum Grade Scale' : 'Nota Máxima de tu País / Sistema'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      value={maxScale}
                      onChange={(e) => handleScaleChange(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 transition-all font-bold"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-mono text-slate-400 pointer-events-none">
                      max
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[20, 10, 5, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleScaleChange(preset)}
                        className={`px-2 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                          maxScale === preset
                            ? 'bg-[#234968] text-white border-[#234968] font-bold'
                            : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Passing threshold row */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                {t('finalGrade.minPassingGrade')} (0 - {maxScale})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={maxScale <= 10 ? 0.1 : 0.5}
                  min="0.1"
                  max={maxScale}
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(Number(e.target.value) || 0)}
                  className="w-full sm:w-48 px-3 py-2 text-sm font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 transition-all"
                />
                <div className="flex gap-1">
                  {thresholdPresets.map((thresh) => (
                    <button
                      key={thresh}
                      type="button"
                      onClick={() => setPassingThreshold(thresh)}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                        passingThreshold === thresh
                          ? 'bg-[#234968] text-white border-[#234968] font-bold'
                          : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                      }`}
                    >
                      {thresh}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                {t('finalGrade.passingThresholdHelp')}
              </p>
            </div>
          </div>

          {/* Dynamic Evaluation Rows */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              {t('finalGrade.evaluations')}
            </label>

            <div className="space-y-2">
              {evaluations.map((ev, index) => (
                <div 
                  key={ev.id}
                  className="p-3 bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 rounded-lg grid grid-cols-12 gap-2.5 items-center transition-all hover:border-slate-300 dark:hover:border-zinc-700"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      value={ev.name}
                      onChange={(e) => handleUpdateEvaluation(ev.id, 'name', e.target.value)}
                      placeholder={`${t('finalGrade.evalName')} ${index + 1}`}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <div className="relative">
                      <input
                        type="number"
                        step={maxScale <= 10 ? 0.1 : 0.5}
                        min="0"
                        max={maxScale}
                        value={ev.score}
                        onChange={(e) => handleUpdateEvaluation(ev.id, 'score', e.target.value)}
                        placeholder={language === 'en' ? 'Score' : 'Nota'}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs font-mono text-slate-400 pointer-events-none">
                        /{maxScale}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ev.weight}
                        onChange={(e) => handleUpdateEvaluation(ev.id, 'weight', e.target.value)}
                        placeholder="%"
                        className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs font-mono text-slate-400 pointer-events-none">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveEvaluation(ev.id)}
                      disabled={evaluations.length <= 1}
                      title={t('finalGrade.remove')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddEvaluation}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#5d95b3] dark:hover:border-[#5d95b3] rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors w-full justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('finalGrade.addEvaluation')}</span>
            </button>
          </div>

          {/* Final Exam Weight Card */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t('finalGrade.finalExamWeight')}</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#234968] text-white font-mono rounded-full">
                  {language === 'en' ? 'Required' : 'Obligatorio'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {language === 'en' ? 'Percentage allocated to the final exam in syllabus.' : 'Porcentaje asignado al examen final en el sílabo académico.'}
              </p>
            </div>
            <div className="w-full sm:w-36 relative">
              <input
                type="number"
                min="1"
                max="100"
                value={finalExamWeight}
                onChange={(e) => setFinalExamWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej. 40"
                className="w-full px-3 py-2 text-base font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-[#234968] dark:text-[#5d95b3] font-bold focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
              />
              <span className="absolute right-3 top-2.5 text-sm font-mono font-semibold text-[#5d95b3] pointer-events-none">
                %
              </span>
            </div>
          </div>

          {/* Weight Validation Alert */}
          {result.totalAllocatedWeight !== 100 && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                {language === 'en' ? (
                  <>Total allocated weight is <strong>{result.totalAllocatedWeight}%</strong>. Must equal 100% for an exact calculation.</>
                ) : (
                  <>La suma de pesos asignados es <strong>{result.totalAllocatedWeight}%</strong>. Para un cálculo exacto debe sumar el 100%.</>
                )}
              </span>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Sticky Instant Results Card (~42% / 5 cols) ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-[#5d95b3] rounded-xl p-6 shadow-cal-card space-y-5">
            
            {/* Status Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {t('finalGrade.results')}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles.badge}`}>
                {statusStyles.label}
              </span>
            </div>

            {/* Big Monospace Number */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {t('finalGrade.neededScore')}:
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {result.requiredFinalScore}
                </span>
                <span className="text-sm font-mono font-medium text-slate-400 dark:text-zinc-500">
                  / {maxScale}.00
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-300 leading-relaxed">
                {statusMessage}
              </p>
            </div>

            {/* Metric Box: Accumulated Points */}
            <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  {language === 'en' ? 'Points accumulated to date' : 'Puntos acumulados a la fecha'}
                </div>
                <div className="text-xs text-slate-600 dark:text-zinc-300 font-medium">
                  {result.accumulatedWeight}% {language === 'en' ? 'of course completed' : 'del curso completado'}
                </div>
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#234968] dark:text-[#5d95b3]">
                {result.accumulatedPoints} pts
              </div>
            </div>

            {/* 1-Click Action Toolbar */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyWhatsappSummary}
                className="w-full py-2.5 px-4 bg-[#234968] hover:bg-[#1a374e] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t('finalGrade.copySummary')}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShareUrl}
                  className="flex-1 py-2 px-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5d95b3]" />
                  <span>{t('common.share')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  title={language === 'en' ? 'Save calculation' : 'Guardar en historial de cálculos'}
                  className="px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded-full text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
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
          3. MATHEMATICAL FORMULA BREAKDOWN (FULL WIDTH BELOW)
         ══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-cal-card space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            {language === 'en' ? 'Mathematical Proof' : 'Transparencia Matemática'}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 {t('finalGrade.formulaBreakdown')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {t('finalGrade.formulaExplanation')} (0 - {maxScale}):
          </p>
        </div>

        {/* LaTeX Canonical Equation */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            {language === 'en' ? 'Canonical Equation' : 'Ecuación Canónica'}
          </div>
          <MathView 
            math={result.canonicalLatex} 
            className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto" 
          />
        </div>

        {/* LaTeX Substitution with Current User Values */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
            {language === 'en' ? `Substitution with your Current Values (Scale 0-${maxScale})` : `Sustitución con tus Valores Actuales (Escala 0-${maxScale})`}
          </div>
          <MathView 
            math={result.substitutionLatex} 
            className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto" 
          />
        </div>

        {/* Resolution Steps */}
        {result.formulaSteps && result.formulaSteps.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {language === 'en' ? 'Step-by-Step Breakdown:' : 'Desglose Paso a Paso:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-slate-600 dark:text-zinc-400">
              {result.formulaSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-slate-500">{step.label}:</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{step.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          4. COMMUNITY SUPPORT & GROWTH SECTION (SIDE BY SIDE)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Growth Card A: Bookmark */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
              <span className="text-amber-500">⭐</span>
              <span>{language === 'en' ? 'Add to Bookmarks' : 'Agrégala a tus marcadores'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {language === 'en' ? (
                <>Save this page with <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> to have it ready each semester.</>
              ) : (
                <>Guarda esta página con <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> para tenerla siempre lista en cada ciclo de estudios.</>
              )}
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                alert(language === 'en' ? 'Press Ctrl + D (Cmd + D on Mac) to bookmark this calculator' : 'Presiona Ctrl + D (Cmd + D en Mac) para guardar esta calculadora en tus marcadores');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#5d95b3]" />
              <span>{language === 'en' ? 'Bookmark Tool' : 'Guardar en Marcadores'}</span>
            </button>
          </div>
        </div>

        {/* Growth Card B: Support with Coffee / Yape */}
        <div className="p-5 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#234968] dark:text-[#5d95b3] mb-1">
              <Coffee className="w-4 h-4" />
              <span>{language === 'en' ? 'Found this useful?' : '¿Te fue de utilidad?'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              {language === 'en' ? 'Calculando is a fast, 100% private math utility suite. Your support helps keep it free and independent.' : 'Calculando es una suite de cálculo rápido y privado. Tu apoyo voluntario contribuye al mantenimiento del servicio.'}
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="px-4 py-2 bg-[#234968] hover:bg-[#1a374e] text-white text-xs font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{t('common.support')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          5. RECENT CALCULATIONS HISTORY DRAWER
         ══════════════════════════════════════════════════════ */}
      {history.length > 0 && (
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-cal-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <History className="w-4 h-4 text-[#5d95b3]" />
              <span>{t('finalGrade.historyTitle')}</span>
            </div>
            <button
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
                onClick={() => handleRestoreHistoryItem(item.data)}
                className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-between text-xs cursor-pointer hover:border-[#5d95b3] dark:hover:border-[#5d95b3] transition-colors group"
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

      {/* ══════════════════════════════════════════════════════
          6. ACADEMIC DISCLAIMER
         ══════════════════════════════════════════════════════ */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-start gap-3 text-xs text-slate-500 dark:text-zinc-400">
        <Info className="w-4 h-4 shrink-0 text-[#5d95b3] mt-0.5" />
        <div>
          {language === 'en' ? (
            <><strong>Rounding Notice:</strong> This calculator applies formal standard arithmetic rounding to 2 decimal places. Verify your university regulations to confirm if rounding applies to partial evaluations or only on the final transcript.</>
          ) : (
            <><strong>Criterio de Redondeo:</strong> Esta herramienta aplica redondeo aritmético estándar a dos decimales. Revisa el reglamento interno de tu institución para confirmar si el redondeo al entero más favorable se aplica en las notas parciales o exclusivamente en el acta final.</>
          )}
        </div>
      </div>

      <Toast message={toastMessage} isVisible={showToast} />
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
};
