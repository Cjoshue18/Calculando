import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark, 
  Copy, 
  RotateCcw, 
  Table 
} from 'lucide-react';
import { TeaInput } from '../domain/types';
import { teaService } from '../adapters/LocalTeaAdapter';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLanguage } from '@/context/LanguageContext';

export const TeaCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [loanAmountStr, setLoanAmountStr] = useState<string>('5000');
  const [teaStr, setTeaStr] = useState<string>('24.5');
  const [termMonths, setTermMonths] = useState<number>(12);
  const [desgravamenStr, setDesgravamenStr] = useState<string>('0.075');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const { copy, copied } = useCopyToClipboard();
  const { getInitialState, syncStateToUrl } = useUrlStateSync<{ p: string; tea: string; n: string; sd: string }>();

  // Read initial state
  useEffect(() => {
    const initial = getInitialState();
    if (initial) {
      if (initial.p) setLoanAmountStr(initial.p);
      if (initial.tea) setTeaStr(initial.tea);
      if (initial.n) setTermMonths(parseInt(initial.n, 10) || 12);
      if (initial.sd) setDesgravamenStr(initial.sd);
    }
  }, [getInitialState]);

  // Sync state to URL
  useEffect(() => {
    syncStateToUrl({ p: loanAmountStr, tea: teaStr, n: termMonths.toString(), sd: desgravamenStr });
  }, [loanAmountStr, teaStr, termMonths, desgravamenStr, syncStateToUrl]);

  const loanAmount = parseFloat(loanAmountStr) || 0;
  const teaPercentage = parseFloat(teaStr) || 0;
  const desgravamenRate = parseFloat(desgravamenStr) || 0;

  const input: TeaInput = useMemo(() => ({
    loanAmount,
    teaPercentage,
    termMonths,
    desgravamenRateMonthly: desgravamenRate,
  }), [loanAmount, teaPercentage, termMonths, desgravamenRate]);

  const result = useMemo(() => teaService.calculate(input), [input]);

  const handleCopySummary = async () => {
    const summaryText = [
      `Simulación de Préstamo (TEA / TCEA) - Calculando.me`,
      `Monto Solicitado: S/ ${loanAmount.toFixed(2)}`,
      `TEA Anual: ${teaPercentage.toFixed(2)}% (TEM: ${result.monthlyTemPercentage.toFixed(3)}%)`,
      `Plazo: ${termMonths} meses`,
      `Cuota Mensual Estimada: S/ ${result.monthlyTotalInitialPayment.toFixed(2)}`,
      `Total Intereses: S/ ${result.totalInterestPaid.toFixed(2)}`,
      `Costo Total del Crédito: S/ ${result.totalCostOfCredit.toFixed(2)}`,
      `TCEA Estimada: ${result.approximateTceaPercentage.toFixed(2)}%`,
    ].join('\n');

    await copy(summaryText);
  };

  const handleReset = () => {
    setLoanAmountStr('5000');
    setTeaStr('24.5');
    setTermMonths(12);
    setDesgravamenStr('0.075');
  };

  return (
    <div className="space-y-6">
      {/* Main Simulator Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEn ? 'TEA / TCEA Loan Simulator' : 'Calculadora de Préstamos TEA / TCEA (Perú)'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {isEn
                  ? 'Calculate French amortization payments, monthly TEM, insurance, and realistic TCEA.'
                  : 'Simula cuotas mensuales (sistema francés), conversión de TEA a TEM, desgravamen y TCEA real.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset' : 'Restablecer'}</span>
          </button>
        </div>

        {/* Inputs & Instant Breakdown Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5">
            {/* Loan Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {isEn ? 'Loan Amount (S/ or $)' : 'Monto del Préstamo (S/)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
                  S/
                </span>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={loanAmountStr}
                  onChange={(e) => setLoanAmountStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums"
                  placeholder="5000"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[1000, 3000, 5000, 10000, 20000, 50000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLoanAmountStr(val.toString())}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    S/ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* TEA Percentage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                  {isEn ? 'Annual Effective Rate (TEA %)' : 'Tasa Efectiva Anual (TEA %)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    value={teaStr}
                    onChange={(e) => setTeaStr(e.target.value)}
                    className="w-full pr-8 pl-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums"
                    placeholder="24.5"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-xs">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                  {isEn ? 'Monthly Desgravamen Rate (%)' : 'Seguro Desgravamen Mensual (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.005"
                    min="0"
                    max="1"
                    value={desgravamenStr}
                    onChange={(e) => setDesgravamenStr(e.target.value)}
                    className="w-full pr-8 pl-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums"
                    placeholder="0.075"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Term in Months */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {isEn ? `Repayment Term: ${termMonths} months` : `Plazo de Devolución: ${termMonths} meses (${(termMonths / 12).toFixed(1)} años)`}
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[6, 12, 18, 24, 36, 48].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className={`py-2 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                      termMonths === m
                        ? 'bg-[#234968] dark:bg-[#5d95b3] text-white dark:text-zinc-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {isEn ? 'Simulated Monthly Payment' : 'Resumen de Cuota Mensual'}
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

            {/* Hero Payment Callout */}
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-zinc-400">
                Cuota Mensual Estimada (Mes 1):
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono tracking-tight text-[#1c384a] dark:text-[#5d95b3] tabular-nums">
                  S/ {result.monthlyTotalInitialPayment.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">/ mes</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <span>Cuota base: S/ {result.monthlyBasePayment.toFixed(2)}</span>
                <span>•</span>
                <span>Desgravamen: S/ {result.monthlyDesgravamenInitial.toFixed(2)}</span>
              </div>
            </div>

            {/* Financial indicators breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Tasa Efectiva Mensual (TEM):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {result.monthlyTemPercentage.toFixed(3)}% mensual
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">TCEA Estimada (con seguros):</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {result.approximateTceaPercentage.toFixed(2)}% anual
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Total Intereses a Pagar:</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                  S/ {result.totalInterestPaid.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] border border-[#b7d2e0] dark:border-[#254157]">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  Costo Total del Crédito (Devolución):
                </span>
                <span className="font-mono font-extrabold text-[#1c384a] dark:text-[#5d95b3] text-sm tabular-nums">
                  S/ {result.totalCostOfCredit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Amortization Table Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            <Table className="w-4 h-4 text-[#5d95b3]" />
            <span>{showSchedule ? 'Ocultar Cronograma de Pagos' : 'Ver Cronograma de Pagos (Primeros 12 meses)'}</span>
          </button>
        </div>

        {/* Amortization Schedule Table */}
        {showSchedule && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5">Mes</th>
                  <th className="p-2.5">Saldo Inicial</th>
                  <th className="p-2.5">Amortización</th>
                  <th className="p-2.5">Interés</th>
                  <th className="p-2.5">Desgravamen</th>
                  <th className="p-2.5">Cuota Total</th>
                  <th className="p-2.5">Saldo Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 tabular-nums">
                {result.scheduleSummary.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50">
                    <td className="p-2.5 font-bold">{row.month}</td>
                    <td className="p-2.5">S/ {row.beginningBalance.toFixed(2)}</td>
                    <td className="p-2.5 text-emerald-600">S/ {row.principal.toFixed(2)}</td>
                    <td className="p-2.5 text-rose-600">S/ {row.interest.toFixed(2)}</td>
                    <td className="p-2.5 text-slate-500">S/ {row.desgravamen.toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-[#234968] dark:text-[#5d95b3]">
                      S/ {row.totalPayment.toFixed(2)}
                    </td>
                    <td className="p-2.5">S/ {row.endingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KaTeX Mathematical Proof Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            Transparencia Matemática
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 Conversión TEA a TEM y Fórmula de Amortización Francesa
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Fórmula matemática financiera estándar conforme al Reglamento de Gestión de Conducta de Mercado (SBS Perú):
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            Fórmulas Canónicas
          </div>
          <MathView
            math={result.canonicalLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-lg font-semibold py-1 overflow-x-auto"
          />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234968] dark:text-[#5d95b3] mb-2">
            Sustitución con tus Valores
          </div>
          <MathView
            math={result.substitutionLatex}
            className="text-[#234968] dark:text-[#5d95b3] text-base font-bold py-1 overflow-x-auto"
          />
        </div>
      </div>

      <Toast message={isEn ? 'Copied to clipboard' : '¡Resumen copiado al portapapeles!'} isVisible={copied} />
    </div>
  );
};
