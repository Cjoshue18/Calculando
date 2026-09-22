import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Share2,
  Copy,
  RotateCcw,
  History,
  Info,
  CheckCircle2,
  Bookmark,
  Coffee,
  AlertTriangle,
} from 'lucide-react';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { SupportModal } from '@/components/support/SupportModal';
import { gpaService } from '../adapters/LocalGpaAdapter';
import { GpaCalculationInput, CourseItem } from '../domain/types';
import { getDefaultPassingGrade } from '../domain/math';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLocalStorageHistory } from '@/core/hooks/useLocalStorageHistory';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useLanguage } from '@/context/LanguageContext';

const defaultCoursesEs: CourseItem[] = [
  { id: '1', name: 'Cálculo I', grade: 14, credits: 4 },
  { id: '2', name: 'Física I', grade: 13, credits: 4 },
  { id: '3', name: 'Programación Básica', grade: 16, credits: 3 },
  { id: '4', name: 'Comunicación', grade: 15, credits: 3 },
];

const defaultCoursesEn: CourseItem[] = [
  { id: '1', name: 'Calculus I', grade: 14, credits: 4 },
  { id: '2', name: 'Physics I', grade: 13, credits: 4 },
  { id: '3', name: 'Computer Science I', grade: 16, credits: 3 },
  { id: '4', name: 'Technical Writing', grade: 15, credits: 3 },
];

export const GpaCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { getInitialState } = useUrlStateSync<GpaCalculationInput>();
  const { history, addHistoryItem, clearHistory } =
    useLocalStorageHistory<GpaCalculationInput>('gpa-calculator');
  const { copy } = useCopyToClipboard();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Initialize state from URL params if shared, else defaults
  const [semesterName, setSemesterName] = useState<string>(() => {
    const initial = getInitialState();
    if (initial?.semesterName !== undefined) return initial.semesterName;
    return language === 'en' ? 'Semester 2026-I' : 'Ciclo 2026-I';
  });

  const [maxScale, setMaxScale] = useState<number>(() => {
    const initial = getInitialState();
    return initial?.maxScale && initial.maxScale > 0 ? initial.maxScale : 20;
  });

  const [passingGrade, setPassingGrade] = useState<number>(() => {
    const initial = getInitialState();
    return initial?.passingGrade ?? getDefaultPassingGrade(20);
  });

  const [courses, setCourses] = useState<CourseItem[]>(() => {
    const initial = getInitialState();
    if (initial?.courses && initial.courses.length > 0) return initial.courses;
    return language === 'en' ? defaultCoursesEn : defaultCoursesEs;
  });

  // Current calculation input
  const currentInput: GpaCalculationInput = useMemo(
    () => ({
      courses,
      maxScale,
      passingGrade,
      semesterName,
    }),
    [courses, maxScale, passingGrade, semesterName]
  );

  // Compute result in-memory with local adapter (0ms latency)
  const result = useMemo(() => {
    return gpaService.calculate(currentInput);
  }, [currentInput]);

  // Handle Scale Change & adapt grades/passing thresholds
  const handleScaleChange = (newScale: number) => {
    if (newScale <= 0) return;
    setMaxScale(newScale);
    const newDefaultPass = getDefaultPassingGrade(newScale);
    setPassingGrade(newDefaultPass);

    // Adjust any grades that exceed the new max scale
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        grade: typeof c.grade === 'number' && c.grade > newScale ? newScale : c.grade,
      }))
    );
  };

  // Add a new empty course row
  const handleAddCourse = () => {
    const newId = Date.now().toString();
    setCourses((prev) => [
      ...prev,
      {
        id: newId,
        name: `${language === 'en' ? 'Course' : 'Asignatura'} ${prev.length + 1}`,
        grade: '',
        credits: 3,
      },
    ]);
  };

  // Remove a course row
  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Update specific field in course row
  const handleUpdateCourse = (
    id: string,
    field: keyof CourseItem,
    value: string | number
  ) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (field === 'grade') {
          if (value === '') return { ...c, grade: '' };
          const num = Number(value);
          if (isNaN(num)) return { ...c, grade: '' };
          return { ...c, grade: num > maxScale ? maxScale : Math.max(0, num) };
        }

        if (field === 'credits') {
          if (value === '') return { ...c, credits: '' };
          const num = Number(value);
          if (isNaN(num)) return { ...c, credits: '' };
          return { ...c, credits: num <= 0 ? '' : Math.min(30, num) };
        }

        return { ...c, [field]: value };
      })
    );
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  // Reset to default sample values
  const handleReset = () => {
    setSemesterName(language === 'en' ? 'Semester 2026-I' : 'Ciclo 2026-I');
    setMaxScale(20);
    setPassingGrade(10.5);
    setCourses(language === 'en' ? defaultCoursesEn : defaultCoursesEs);
    triggerToast(t('gpa.resetConfirmation'));
  };

  // Save calculation to local history
  const handleSaveToHistory = () => {
    const periodLabel = semesterName ? `${semesterName}: ` : '';
    const summary = `${periodLabel}PPA ${result.weightedAverage}/${maxScale} (${result.totalCredits} cr.)`;
    addHistoryItem(summary, currentInput);
    triggerToast(
      language === 'en'
        ? 'GPA saved to history'
        : 'Promedio guardado en el historial'
    );
  };

  // Share tool link
  const handleShareUrl = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    await copy(cleanUrl);
    triggerToast(
      language === 'en'
        ? 'Tool link copied to clipboard'
        : 'Enlace de la herramienta copiado al portapapeles'
    );
  };

  // Copy comprehensive GPA summary (formatted for WhatsApp/Email)
  const handleCopyGpaSummary = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    const statusLabel =
      result.status === 'approved'
        ? t('gpa.statusApprovedBadge')
        : result.status === 'at_risk'
        ? t('gpa.statusAtRiskBadge')
        : result.status === 'failed'
        ? t('gpa.statusFailedBadge')
        : t('gpa.statusEmptyBadge');

    const lines = [
      language === 'en'
        ? '*Calculando — Credit-Weighted GPA Summary*'
        : '*Calculando — Resumen de Promedio Ponderado por Créditos*',
      semesterName
        ? `${language === 'en' ? 'Period' : 'Periodo'}: ${semesterName}`
        : '',
      `${language === 'en' ? 'Scale' : 'Escala máxima'}: 0 - ${maxScale}`,
      `*${language === 'en' ? 'Weighted GPA' : 'Promedio Ponderado (PPA)'}: ${result.weightedAverage} / ${maxScale}*`,
      `${language === 'en' ? 'Academic Standing' : 'Condición Académica'}: ${statusLabel}`,
      `${language === 'en' ? 'Total Enrolled Credits' : 'Créditos Matriculados'}: ${result.totalCredits}`,
      `${language === 'en' ? 'Total Weighted Points' : 'Puntos Ponderados Totales'}: ${result.totalPoints} pts`,
      '',
      language === 'en' ? 'Course Breakdown:' : 'Detalle de Asignaturas:',
      ...result.coursesBreakdown.map(
        (c) =>
          `• ${c.name}: ${c.grade}/${maxScale} (${c.credits} cr.) = ${c.points} pts`
      ),
      '',
      `${language === 'en' ? 'Calculate yours at' : 'Calcula el tuyo en'}: ${cleanUrl}`,
    ].filter(Boolean);

    await copy(lines.join('\n'));
    triggerToast(t('gpa.copiedResult'));
  };

  // Restore history calculation
  const handleRestoreHistoryItem = (item: GpaCalculationInput) => {
    if (item.maxScale) setMaxScale(item.maxScale);
    if (item.passingGrade !== undefined) setPassingGrade(item.passingGrade);
    if (item.semesterName !== undefined) setSemesterName(item.semesterName);
    if (item.courses && item.courses.length > 0) setCourses(item.courses);
    triggerToast(
      language === 'en'
        ? 'Calculation restored from history'
        : 'Cálculo restaurado desde historial'
    );
  };

  // Status visual styles strictly following Calculando design tokens
  const statusStyles = {
    approved: {
      badge: 'bg-[#10b981] text-white',
      accentColor: 'text-[#10b981]',
      label: t('gpa.statusApprovedBadge'),
      description: t('gpa.statusApproved'),
    },
    at_risk: {
      badge: 'bg-amber-600 text-white',
      accentColor: 'text-amber-600 dark:text-amber-400',
      label: t('gpa.statusAtRiskBadge'),
      description: t('gpa.statusAtRisk'),
    },
    failed: {
      badge: 'bg-rose-600 text-white',
      accentColor: 'text-rose-600 dark:text-rose-400',
      label: t('gpa.statusFailedBadge'),
      description: t('gpa.statusFailed'),
    },
    empty: {
      badge: 'bg-slate-500 text-white',
      accentColor: 'text-slate-500',
      label: t('gpa.statusEmptyBadge'),
      description: t('gpa.statusEmpty'),
    },
  }[result.status];

  return (
    <div className="space-y-8 font-sans">
      {/* ══════════════════════════════════════════════════════
          1. TOOL HEADER
         ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('gpa.pageTitle')}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {t('gpa.pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleShareUrl}
            title={t('gpa.shareTitle')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#5d95b3]" />
            <span>{t('gpa.shareBtn')}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            title={t('gpa.resetTitle')}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. TWO-COLUMN WORKSPACE (7 COLS INPUT / 5 COLS RESULT)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Course Input Rows (~58% / 7 cols) ── */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 shadow-cal-card space-y-6">
          
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {t('gpa.inputTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {t('gpa.inputSubtitle')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200">
                {result.totalCredits} cr.
              </span>
              <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                {courses.length} {t('gpa.coursesCount')}
              </span>
            </div>
          </div>

          {/* Scale Selector and General Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Optional Semester Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  {t('gpa.semesterLabel')}
                </label>
                <input
                  type="text"
                  value={semesterName}
                  onChange={(e) => setSemesterName(e.target.value)}
                  placeholder={t('gpa.semesterPlaceholder')}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 transition-all"
                />
              </div>

              {/* Grading Scale Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    {t('gpa.scaleSelectorLabel')}
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
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 font-bold"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-mono text-slate-400 pointer-events-none">
                      max
                    </span>
                  </div>

                  {/* Scale Presets (0-20 default, 0-10, 0-4) */}
                  <div className="flex gap-1">
                    {[20, 10, 4].map((scaleVal) => (
                      <button
                        key={scaleVal}
                        type="button"
                        onClick={() => handleScaleChange(scaleVal)}
                        className={`px-2.5 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                          maxScale === scaleVal
                            ? 'bg-[#234968] text-white border-[#234968] font-bold'
                            : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {scaleVal === 20 ? '0-20' : scaleVal === 10 ? '0-10' : '0-4.0'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Passing Grade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-md">
              <div className="text-xs text-slate-600 dark:text-zinc-400">
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {t('gpa.passingGradeLabel')}:
                </span>{' '}
                <span className="font-mono text-slate-500">
                  ({maxScale === 20 ? '10.5 en Perú' : maxScale === 10 ? '5.0 / 6.0' : '2.0 en GPA 4.0'})
                </span>
              </div>
              <div className="w-28 relative">
                <input
                  type="number"
                  step={maxScale <= 10 ? 0.1 : 0.5}
                  min="0"
                  max={maxScale}
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1 text-xs font-mono tabular-nums text-right bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3] text-slate-900 dark:text-zinc-100 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Interactive Course Rows Table */}
          <div className="space-y-3 pt-2">
            {/* Table Header Row */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <div className="col-span-5">{t('gpa.courseHeaderName')}</div>
              <div className="col-span-3">{t('gpa.courseHeaderGrade')} (0-{maxScale})</div>
              <div className="col-span-2">{t('gpa.courseHeaderCredits')}</div>
              <div className="col-span-2 text-right">{t('gpa.courseHeaderPoints')}</div>
            </div>

            {/* List of courses */}
            <div className="space-y-2">
              {courses.map((course, index) => {
                const gradeNum = typeof course.grade === 'number' ? course.grade : 0;
                const creditsNum = typeof course.credits === 'number' ? course.credits : 0;
                const points = Number((gradeNum * creditsNum).toFixed(2));
                const isUnderPassing = course.grade !== '' && gradeNum < passingGrade;

                return (
                  <div
                    key={course.id}
                    className="p-3 bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 rounded-md grid grid-cols-12 gap-2.5 items-center transition-all hover:border-slate-300 dark:hover:border-zinc-700"
                  >
                    {/* Course Name */}
                    <div className="col-span-12 sm:col-span-5">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                        placeholder={`${t('gpa.courseNamePlaceholder')} ${index + 1}`}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                      />
                    </div>

                    {/* Grade Input */}
                    <div className="col-span-5 sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          step={maxScale <= 10 ? 0.1 : 0.5}
                          min="0"
                          max={maxScale}
                          value={course.grade}
                          onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                          placeholder={t('gpa.gradePlaceholder')}
                          className={`w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3] ${
                            isUnderPassing
                              ? 'border-rose-300 text-rose-700 dark:border-rose-900 dark:text-rose-400'
                              : 'border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white'
                          }`}
                        />
                        <span className="absolute right-2 top-1.5 text-[10px] font-mono text-slate-400 pointer-events-none">
                          /{maxScale}
                        </span>
                      </div>
                    </div>

                    {/* Credits Input */}
                    <div className="col-span-4 sm:col-span-2">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          step="1"
                          value={course.credits}
                          onChange={(e) => handleUpdateCourse(course.id, 'credits', e.target.value)}
                          placeholder={t('gpa.creditsPlaceholder')}
                          className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#5d95b3]"
                        />
                        <span className="absolute right-2 top-1.5 text-[10px] font-mono text-slate-400 pointer-events-none">
                          cr.
                        </span>
                      </div>
                    </div>

                    {/* Points indicator & Delete Button */}
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5">
                      <span className="text-xs font-mono tabular-nums font-semibold text-[#234968] dark:text-[#5d95b3]">
                        {points.toFixed(1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(course.id)}
                        disabled={courses.length <= 1}
                        title={t('gpa.removeCourse')}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Course Button */}
            <button
              type="button"
              onClick={handleAddCourse}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 border border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#5d95b3] dark:hover:border-[#5d95b3] rounded-md text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors w-full justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('gpa.addCourse')}</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Big Sticky Result Card (~42% / 5 cols) ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-[#5d95b3] rounded-lg p-6 shadow-cal-card space-y-5">
            
            {/* Header: Result Title and Status Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {t('gpa.resultsTitle')}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusStyles.badge}`}>
                {statusStyles.label}
              </span>
            </div>

            {/* Huge Bold Average */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {t('gpa.weightedAverageLabel')}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {result.weightedAverage.toFixed(2)}
                </span>
                <span className="text-sm font-mono font-medium text-slate-400 dark:text-zinc-500">
                  / {maxScale}.00
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-300 leading-relaxed">
                {statusStyles.description}
              </p>
            </div>

            {/* Metrics Breakdown Box: Credits & Points */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  {t('gpa.totalCreditsBoxLabel')}
                </div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100">
                  {result.totalCredits} <span className="text-xs font-normal text-slate-400">cr.</span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  {t('gpa.totalPointsBoxLabel')}
                </div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#234968] dark:text-[#5d95b3]">
                  {result.totalPoints.toFixed(1)} <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
              </div>
            </div>

            {/* Approved vs Failed Credits Sub-metric */}
            {result.totalCredits > 0 && (
              <div className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('gpa.approvedCourses')} {result.approvedCredits} cr.
                </span>
                {result.failedCredits > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t('gpa.failedCourses')} {result.failedCredits} cr.
                  </span>
                )}
              </div>
            )}

            {/* 1-Click Action Toolbar */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyGpaSummary}
                className="w-full py-2.5 px-4 bg-[#234968] hover:bg-[#1a374e] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t('gpa.copyResult')}</span>
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
                  title={language === 'en' ? 'Save calculation' : 'Guardar cálculo en historial'}
                  className="px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#5d95b3]" />
                  <span>{language === 'en' ? 'Save' : 'Guardar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title={t('gpa.resetTitle')}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          3. MATHEMATICAL FORMULA BREAKDOWN (FULL WIDTH BELOW)
         ══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 shadow-cal-card space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            {language === 'en' ? 'Mathematical Proof' : 'Demostración Matemática'}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 {t('gpa.formulaBreakdown')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {t('gpa.formulaExplanation')}
          </p>
        </div>

        {/* LaTeX Canonical Equation */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            {t('gpa.canonicalEquation')}
          </div>
          <MathView
            math={result.canonicalLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto"
          />
        </div>

        {/* LaTeX Substitution with Current User Values */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
            {t('gpa.substitutionEquation')} (Escala 0-{maxScale})
          </div>
          <MathView
            math={result.substitutionLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto"
          />
        </div>

        {/* Resolution Steps / Breakdown per course */}
        {result.formulaSteps && result.formulaSteps.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {t('gpa.stepByStep')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-slate-600 dark:text-zinc-400">
              {result.formulaSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-md border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
                >
                  <span className="text-slate-500">{step.label}:</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">
                    {step.value}
                  </span>
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
        {/* Bookmark Card */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
              <span className="text-amber-500">⭐</span>
              <span>{language === 'en' ? 'Add to Bookmarks' : 'Agrégala a tus marcadores'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {language === 'en' ? (
                <>Save this page with <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> to have it ready for each exam season.</>
              ) : (
                <>Guarda esta página con <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl + D</kbd> para consultar tu promedio ponderado al cierre de cada semestre.</>
              )}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                alert(
                  language === 'en'
                    ? 'Press Ctrl + D (Cmd + D on Mac) to bookmark this calculator'
                    : 'Presiona Ctrl + D (Cmd + D en Mac) para guardar esta calculadora en tus marcadores'
                );
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#5d95b3]" />
              <span>{language === 'en' ? 'Bookmark Tool' : 'Guardar en Marcadores'}</span>
            </button>
          </div>
        </div>

        {/* Support with Coffee / Yape Modal */}
        <div className="p-5 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#234968] dark:text-[#5d95b3] mb-1">
              <Coffee className="w-4 h-4" />
              <span>{language === 'en' ? 'Found this useful?' : '¿Te fue de utilidad?'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              {language === 'en'
                ? 'Calculando is a fast, 100% private math utility suite. Your support helps keep it ad-free and free forever.'
                : 'Calculando es una suite de cálculo rápido, 100% client-side y privada. Tu apoyo contribuye al mantenimiento libre de publicidad.'}
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
          5. RECENT CALCULATIONS HISTORY DRAWER
         ══════════════════════════════════════════════════════ */}
      {history.length > 0 && (
        <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-cal-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <History className="w-4 h-4 text-[#5d95b3]" />
              <span>{t('gpa.historyTitle')}</span>
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
                onClick={() => handleRestoreHistoryItem(item.data)}
                className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md flex items-center justify-between text-xs cursor-pointer hover:border-[#5d95b3] dark:hover:border-[#5d95b3] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="text-slate-800 dark:text-zinc-200 font-semibold group-hover:text-[#234968] dark:group-hover:text-[#5d95b3]">
                    {item.summary}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          6. ACADEMIC ROUNDING DISCLAIMER
         ══════════════════════════════════════════════════════ */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-start gap-3 text-xs text-slate-500 dark:text-zinc-400">
        <Info className="w-4 h-4 shrink-0 text-[#5d95b3] mt-0.5" />
        <div>{t('gpa.disclaimer')}</div>
      </div>

      <Toast message={toastMessage} isVisible={showToast} />
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
};
