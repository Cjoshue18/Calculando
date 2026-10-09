import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  Copy, 
  RotateCcw, 
  Printer, 
  Share2, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { RentaQuintaInput } from '../domain/types';
import { DEFAULT_UIT_2026 } from '../domain/math';
import { rentaQuintaService } from '../adapters/LocalRentaQuintaAdapter';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLanguage } from '@/context/LanguageContext';

export const RentaQuintaCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [salaryStr, setSalaryStr] = useState<string>('4500');
  const [hasGratifications, setHasGratifications] = useState<boolean>(true);
  const [uitValue, setUitValue] = useState<number>(DEFAULT_UIT_2026);
  const [additionalDeductionStr, setAdditionalDeductionStr] = useState<string>('0');

  const { copy, copied } = useCopyToClipboard();
  const { getInitialState, syncStateToUrl } = useUrlStateSync<{ s: string; g: string; u: number; d: string }>();

  // Read initial URL state
  useEffect(() => {
    const initial = getInitialState();
    if (initial) {
      if (initial.s) setSalaryStr(initial.s);
      if (initial.g !== undefined) setHasGratifications(initial.g === '1');
      if (initial.u) setUitValue(Number(initial.u));
      if (initial.d) setAdditionalDeductionStr(initial.d);
    }
  }, [getInitialState]);

  // Sync to URL
  useEffect(() => {
    syncStateToUrl({
      s: salaryStr,
      g: hasGratifications ? '1' : '0',
      u: uitValue,
      d: additionalDeductionStr,
    });
  }, [salaryStr, hasGratifications, uitValue, additionalDeductionStr, syncStateToUrl]);

  const salaryNum = parseFloat(salaryStr) || 0;
  const additionalNum = parseFloat(additionalDeductionStr) || 0;

  const input: RentaQuintaInput = useMemo(() => ({
    monthlySalary: salaryNum,
    uitValue,
    hasGratifications,
    additionalDeductionUit: additionalNum,
  }), [salaryNum, uitValue, hasGratifications, additionalNum]);

  const result = useMemo(() => rentaQuintaService.calculate(input), [input]);

  const handleCopySummary = async () => {
    const summaryText = [
      `Cálculo de Impuesto a la Renta de 5ta Categoría - Calculando.me`,
      `Sueldo Bruto Mensual: S/ ${salaryNum.toFixed(2)}`,
      `Ingresos Anuales Proyectados: S/ ${result.annualGrossIncome.toFixed(2)}`,
      `Deducción Inafecta (7 UIT): S/ ${result.base7UitDeduction.toFixed(2)}`,
      `Renta Neta Imponible: S/ ${result.netTaxableIncome.toFixed(2)}`,
      `Impuesto a la Renta Anual: S/ ${result.annualTax.toFixed(2)}`,
      `Retención Mensual Estimada: S/ ${result.monthlyWithholding.toFixed(2)}`,
      `Tasa Efectiva Real: ${result.effectiveRatePercentage.toFixed(2)}%`,
      `Calculado en: https://calculando.me/calculadora-renta-quinta-categoria`,
    ].join('\n');

    await copy(summaryText);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Retención de 5ta Categoría para sueldo de S/ ${salaryNum.toFixed(2)}: Descuento mensual de S/ ${result.monthlyWithholding.toFixed(2)} (Impuesto Anual: S/ ${result.annualTax.toFixed(2)}). Compruébalo aquí: https://calculando.me/calculadora-renta-quinta-categoria`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setSalaryStr('4500');
    setHasGratifications(true);
    setUitValue(DEFAULT_UIT_2026);
    setAdditionalDeductionStr('0');
  };

  const isExempt = result.netTaxableIncome === 0;

  return (
    <div className="space-y-6">
      {/* Main Calculator Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEn ? 'Peru 5th Category Income Tax Calculator' : 'Calculadora de Impuesto a la Renta de 5ta Categoría'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {isEn 
                  ? 'Calculate payroll tax withholding for dependent workers in Peru (SUNAT).' 
                  : 'Cálculo de retención mensual en boleta y tramos de SUNAT para trabajadores en planilla.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Imprimir cálculo"
              title="Imprimir cálculo"
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

        {/* Inputs & Instant Breakdown Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {isEn ? 'Monthly Gross Salary (S/)' : 'Sueldo Bruto Mensual en Planilla (S/)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
                  S/
                </span>
                <input
                  type="number"
                  step="50"
                  min="0"
                  value={salaryStr}
                  onChange={(e) => setSalaryStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Quick Salary Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[2500, 3200, 4500, 6000, 8500, 12000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalaryStr(val.toString())}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  S/ {val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Gratifications checkbox */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGratifications}
                  onChange={(e) => setHasGratifications(e.target.checked)}
                  className="w-4 h-4 rounded text-[#234968] focus:ring-[#5d95b3] cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                  {isEn 
                    ? 'Includes 2 Legal Gratifications (July & December + 9% Bonus)' 
                    : 'Incluye 2 Gratificaciones Legales (Julio y Diciembre + 9% Bonificación)'}
                </span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pl-6 leading-relaxed">
                Régimen laboral general (D.L. 728). Se computan 14 sueldos al año más el 9% de inafectación de EsSalud (Ley 30334).
              </p>
            </div>

            {/* Additional Deductions & UIT options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5">
                  Valor de la UIT
                </label>
                <select
                  value={uitValue}
                  onChange={(e) => setUitValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                >
                  <option value={5150}>UIT 2026 - S/ 5,150</option>
                  <option value={5350}>UIT 2025 - S/ 5,350</option>
                  <option value={5150}>UIT 2024 - S/ 5,150</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Gastos Deducibles (3 UIT)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Máx S/ {(3 * uitValue).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={3 * uitValue}
                  value={additionalDeductionStr}
                  onChange={(e) => setAdditionalDeductionStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3]"
                />
              </div>
            </div>

            {/* Quick Notice */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs">
              <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#234968] dark:text-[#5d95b3]" />
              <p className="leading-relaxed">
                <strong>¿Sabías que?</strong> Los primeros <strong>7 UIT</strong> (S/ {(7 * uitValue).toLocaleString()}) de ingresos anuales están totalmente <strong>libres de impuestos</strong>. Si ganas menos de S/ {Math.floor((7 * uitValue) / (hasGratifications ? 14.18 : 12)).toLocaleString()} al mes, tu retención es S/ 0.
              </p>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {isEn ? 'SUNAT Withholding Summary' : 'Liquidación Proyectada en Boleta'}
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy' : 'Copiar Resumen')}</span>
              </button>
            </div>

            {/* Main Result Hero */}
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Retención Mensual Estimada
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono font-black text-2xl sm:text-3xl text-[#1c384a] dark:text-[#5d95b3] tabular-nums">
                    S/ {result.monthlyWithholding.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">/ mes</span>
                </div>
              </div>

              <div className="text-right">
                {isExempt ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Inafecto (0%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <TrendingDown className="w-3.5 h-3.5" /> Tasa {result.effectiveRatePercentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Ingresos Brutos Anuales (con Grati):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  S/ {result.annualGrossIncome.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Deducción de Ley (7 UIT):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  - S/ {result.base7UitDeduction.toFixed(2)}
                </span>
              </div>

              {result.additionalDeduction > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-600 dark:text-zinc-400">Gastos Adicionales Deducibles:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    - S/ {result.additionalDeduction.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] border border-[#b7d2e0] dark:border-[#254157]">
                <span className="font-bold text-slate-900 dark:text-white">Renta Neta Imponible:</span>
                <span className="font-mono font-bold text-[#1c384a] dark:text-[#5d95b3] text-sm tabular-nums">
                  S/ {result.netTaxableIncome.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <span className="font-bold text-rose-800 dark:text-rose-300">Impuesto a la Renta Anual Total:</span>
                <span className="font-mono font-black text-rose-800 dark:text-rose-300 text-sm tabular-nums">
                  S/ {result.annualTax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Progressive Tax Tiers Table */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Desglose por Escala Progresiva (Art. 53 LIR)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-left">
                      <th className="py-1.5 font-semibold">Tramo</th>
                      <th className="py-1.5 font-semibold">Tasa</th>
                      <th className="py-1.5 font-semibold text-right">Monto Afecto</th>
                      <th className="py-1.5 font-semibold text-right">Impuesto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {result.brackets.map((b, idx) => (
                      <tr key={idx} className={b.taxableAmountInBracket > 0 ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                        <td className="py-1.5 font-medium text-slate-700 dark:text-zinc-300">{b.bracket}</td>
                        <td className="py-1.5 font-mono text-slate-600 dark:text-zinc-400">{(b.rate * 100).toFixed(0)}%</td>
                        <td className="py-1.5 font-mono text-right text-slate-900 dark:text-white tabular-nums">
                          S/ {b.taxableAmountInBracket.toFixed(2)}
                        </td>
                        <td className="py-1.5 font-mono font-semibold text-right text-rose-700 dark:text-rose-400 tabular-nums">
                          S/ {b.taxAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
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
            Transparencia Matemática y Legal
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 Formulación Oficial SUNAT (Art. 46 y 53 de la Ley del Impuesto a la Renta)
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Cálculo progresivo por tramos escalonados según el valor de la Unidad Impositiva Tributaria (UIT):
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            Fórmula Formal del Impuesto
          </div>
          <MathView
            math={result.canonicalLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto"
          />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
            Sustitución con tus Ingresos
          </div>
          <MathView
            math={result.substitutionLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto"
          />
        </div>
      </div>

      <Toast message={isEn ? 'Summary copied to clipboard' : '¡Resumen copiado al portapapeles!'} isVisible={copied} />
    </div>
  );
};
