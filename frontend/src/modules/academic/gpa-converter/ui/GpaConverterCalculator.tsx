import React, { useState, useMemo, useEffect } from 'react';
import { 
  GraduationCap, 
  Copy, 
  RotateCcw, 
  Printer, 
  Share2, 
  Award
} from 'lucide-react';
import { VigesimalGradeInput } from '../domain/types';
import { gpaConverterService } from '../adapters/LocalGpaConverterAdapter';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLanguage } from '@/context/LanguageContext';

export const GpaConverterCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [gradeStr, setGradeStr] = useState<string>('16.5');
  const [passingGrade, setPassingGrade] = useState<number>(11.0);

  const { copy, copied } = useCopyToClipboard();
  const { getInitialState, syncStateToUrl } = useUrlStateSync<{ n: string; p: number }>();

  // Read initial URL state
  useEffect(() => {
    const initial = getInitialState();
    if (initial) {
      if (initial.n) setGradeStr(initial.n);
      if (initial.p) setPassingGrade(Number(initial.p));
    }
  }, [getInitialState]);

  // Sync to URL
  useEffect(() => {
    syncStateToUrl({ n: gradeStr, p: passingGrade });
  }, [gradeStr, passingGrade, syncStateToUrl]);

  const gradeNum = parseFloat(gradeStr) || 0;

  const input: VigesimalGradeInput = useMemo(() => ({
    grade: gradeNum,
    passingGrade,
  }), [gradeNum, passingGrade]);

  const result = useMemo(() => gpaConverterService.calculate(input), [input]);

  const handleCopySummary = async () => {
    const summaryText = [
      `Conversión de Escala Vigesimal (0-20) a GPA y ECTS - Calculando.me`,
      `Promedio Ponderado Vigesimal: ${result.vigesimalGrade.toFixed(2)} / 20.00`,
      `GPA Estadounidense (4.0): ${result.usGpa.toFixed(2)} (${result.letterGrade})`,
      `Escala Europea ECTS: Grado ${result.ectsGrade} (${result.ectsDescription})`,
      `Fórmula Bávara (Alemania/DAAD): ${result.bavarianGrade.toFixed(2)}`,
      `Ubicación Académica Estimada: ${result.academicHonors}`,
      `Estado: ${result.isPassing ? 'Aprobado' : 'Desaprobado'}`,
      `Calculado en: https://calculando.me/conversor-notas-gpa-vigesimal`,
    ].join('\n');

    await copy(summaryText);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Mi nota vigesimal de ${result.vigesimalGrade.toFixed(2)} equivale a un GPA de ${result.usGpa.toFixed(2)} (${result.letterGrade}) y Grado ECTS ${result.ectsGrade}. Conoce tu equivalencia internacional aquí: https://calculando.me/conversor-notas-gpa-vigesimal`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setGradeStr('16.5');
    setPassingGrade(11.0);
  };

  return (
    <div className="space-y-6">
      {/* Main Calculator Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEn ? 'Vigesimal (0-20) to US GPA & ECTS Converter' : 'Conversor de Notas Vigesimal (0-20) a GPA y ECTS'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {isEn 
                  ? 'Convert Peruvian university grades to 4.0 GPA, European ECTS, and German Bavarian scales for scholarship applications.' 
                  : 'Equivalencia de promedio universitario peruano a GPA 4.0 (EE.UU.), ECTS (Europa) y escala alemana para becas y posgrados.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Imprimir conversión"
              title="Imprimir conversión"
              className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              aria-label="Compartir en WhatsApp"
              title="Compartir en WhatsApp"
              className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset' : 'Restablecer'}</span>
            </button>
          </div>
        </div>

        {/* Inputs & Hero Outputs Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {isEn ? 'Vigesimal Grade / Cumulative Average (0 - 20)' : 'Nota o Promedio Vigesimal (0.00 a 20.00)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={gradeStr}
                  onChange={(e) => setGradeStr(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-2xl font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums text-center"
                  placeholder="16.00"
                />
              </div>
            </div>

            {/* Quick Grade Chips */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[11.0, 13.5, 14.8, 16.0, 17.5, 19.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGradeStr(val.toFixed(1))}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  {val.toFixed(1)}
                </button>
              ))}
            </div>

            {/* Passing Grade Selector */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Nota Mínima Aprobatoria de la Universidad
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPassingGrade(11.0)}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    passingGrade === 11.0
                      ? 'bg-white dark:bg-zinc-900 text-[#234968] dark:text-[#5d95b3] border-[#5d95b3] shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  11.0 (PUCP, UNI, UNMSM)
                </button>
                <button
                  type="button"
                  onClick={() => setPassingGrade(10.5)}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    passingGrade === 10.5
                      ? 'bg-white dark:bg-zinc-900 text-[#234968] dark:text-[#5d95b3] border-[#5d95b3] shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  10.5 (Con redondeo a 11)
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                Utilizado para estandarizar la escala alemana (Modifizierte Bayerische Formel) y calcular el umbral reprobatorio.
              </p>
            </div>

            {/* Academic Standing Banner */}
            <div className="p-3 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] border border-[#b7d2e0] dark:border-[#254157] flex items-center gap-3">
              <Award className="w-5 h-5 text-[#234968] dark:text-[#5d95b3] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {result.academicHonors}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-zinc-400">
                  {result.ectsDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {isEn ? 'International Equivalencies' : 'Equivalencias Internacionales'}
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy' : 'Copiar Resultados')}</span>
              </button>
            </div>

            {/* 3 Main Scale Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* US GPA */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  GPA (EE.UU. / WES)
                </span>
                <div className="mt-1 font-mono font-black text-2xl text-[#1c384a] dark:text-[#5d95b3] tabular-nums">
                  {result.usGpa.toFixed(2)}
                </div>
                <div className="mt-0.5 inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  Letra: {result.letterGrade}
                </div>
              </div>

              {/* European ECTS */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  ECTS (Europa)
                </span>
                <div className="mt-1 font-mono font-black text-2xl text-emerald-600 dark:text-emerald-400 tabular-nums">
                  Grado {result.ectsGrade}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 truncate">
                  {result.isPassing ? 'Aprobado ECTS' : 'Reprobado FX'}
                </div>
              </div>

              {/* German Bavarian Scale */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  Alemania (DAAD)
                </span>
                <div className="mt-1 font-mono font-black text-2xl text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {result.bavarianGrade.toFixed(2)}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                  (1.0 mejor / 4.0 mín)
                </div>
              </div>
            </div>

            {/* Equivalency Table Highlighting */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
                <span>Tabla de Conversión Oficial WES / Fulbright</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                  Fila seleccionada resalta en azul
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-left">
                      <th className="py-2 px-2 font-semibold">Escala Vigesimal</th>
                      <th className="py-2 px-2 font-semibold">GPA (4.0)</th>
                      <th className="py-2 px-2 font-semibold">Letra</th>
                      <th className="py-2 px-2 font-semibold">ECTS</th>
                      <th className="py-2 px-2 font-semibold">Equivalencia Académica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono text-[11px]">
                    {result.table.map((row, idx) => {
                      const isMatched = idx === result.matchingRowIndex;
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isMatched
                              ? 'bg-blue-100/70 dark:bg-[#1c384a]/60 text-slate-900 dark:text-white font-bold ring-1 ring-[#5d95b3]'
                              : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/50'
                          }`}
                        >
                          <td className="py-2 px-2 tabular-nums">
                            {isMatched ? '👉 ' : ''}{row.vigesimalRange}
                          </td>
                          <td className="py-2 px-2 font-bold tabular-nums">{row.usGpa.toFixed(2)}</td>
                          <td className="py-2 px-2">{row.letterGrade}</td>
                          <td className="py-2 px-2 font-bold">{row.ectsGrade}</td>
                          <td className="py-2 px-2 font-sans text-[11px] font-normal">{row.descriptionEs}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KaTeX Mathematical Proof Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            Metodología y Fórmulas de Conversión
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 Formulación Matemática: WES & Modifizierte Bayerische Formel (Fórmula Bávara)
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Fórmulas empleadas por comités de admisión internacional y servicios de becas (DAAD, Chevening, Fulbright):
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            Fórmula General
          </div>
          <MathView
            math={result.canonicalLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto"
          />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
            Sustitución con tu Nota
          </div>
          <MathView
            math={result.substitutionLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto"
          />
        </div>
      </div>

      <Toast message={isEn ? 'Results copied to clipboard' : '¡Resultados copiados al portapapeles!'} isVisible={copied} />
    </div>
  );
};
