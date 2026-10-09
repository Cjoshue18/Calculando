import React, { useState, useMemo, useEffect } from 'react';
import { 
  Receipt, 
  Copy, 
  RotateCcw, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';
import { IgvInput, IgvOperationMode, DetractionRateType } from '../domain/types';
import { DETRACTION_OPTIONS, SPOT_THRESHOLD_PEN } from '../domain/math';
import { igvService } from '../adapters/LocalIgvAdapter';
import { MathView } from '@/components/ui/MathView';
import { Toast } from '@/components/ui/Toast';
import { useCopyToClipboard } from '@/core/hooks/useCopyToClipboard';
import { useUrlStateSync } from '@/core/hooks/useUrlStateSync';
import { useLanguage } from '@/context/LanguageContext';

export const IgvCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [mode, setMode] = useState<IgvOperationMode>('add');
  const [amountStr, setAmountStr] = useState<string>('1000');
  const [detractionType, setDetractionType] = useState<DetractionRateType>('services_12');
  const { copy, copied } = useCopyToClipboard();
  const { getInitialState, syncStateToUrl } = useUrlStateSync<{ m: IgvOperationMode; a: string; d: DetractionRateType }>();

  // Read initial state
  useEffect(() => {
    const initial = getInitialState();
    if (initial) {
      if (initial.m === 'add' || initial.m === 'extract') setMode(initial.m);
      if (initial.a) setAmountStr(initial.a);
      if (initial.d) setDetractionType(initial.d);
    }
  }, [getInitialState]);

  // Sync state to URL
  useEffect(() => {
    syncStateToUrl({ m: mode, a: amountStr, d: detractionType });
  }, [mode, amountStr, detractionType, syncStateToUrl]);

  const amountNum = parseFloat(amountStr) || 0;

  const input: IgvInput = useMemo(() => ({
    amount: amountNum,
    mode,
    detractionType,
  }), [amountNum, mode, detractionType]);

  const result = useMemo(() => igvService.calculate(input), [input]);

  const handleCopySummary = async () => {
    const summaryText = [
      `Cálculo de IGV y Detracción - Calculando.me`,
      `Modo: ${mode === 'add' ? 'Monto Base + 18% IGV' : 'Monto Total Desglosado'}`,
      `Base Imponible: S/ ${result.baseAmount.toFixed(2)}`,
      `IGV (18%): S/ ${result.igvAmount.toFixed(2)}`,
      `Total Facturado: S/ ${result.totalAmount.toFixed(2)}`,
      result.appliesDetraction 
        ? `Detracción (${(result.detractionRate * 100).toFixed(0)}%): S/ ${result.detractionAmount.toFixed(2)}\nNeto a Cobrar/Pagar: S/ ${result.netPayableAmount.toFixed(2)}`
        : `Detracción: No aplica (Total ≤ S/ ${SPOT_THRESHOLD_PEN} o tasa 0%)`,
    ].join('\n');

    await copy(summaryText);
  };

  const handleReset = () => {
    setAmountStr('1000');
    setMode('add');
    setDetractionType('none');
  };

  return (
    <div className="space-y-6">
      {/* Main Calculator Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEn ? 'Peru IGV 18% & Sunat Detractions' : 'Calculadora de IGV y Detracciones (Perú)'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {isEn 
                  ? 'Calculate taxable base, 18% sales tax, and Banco de la Nación SPOT withholdings.' 
                  : 'Cálculo de Base Imponible, 18% IGV y retención SPOT de SUNAT conforme a ley.'}
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

        {/* Mode Switcher Tabs */}
        <div className="mt-6 flex p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'add'
                ? 'bg-white dark:bg-zinc-900 text-[#234968] dark:text-[#5d95b3] shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isEn ? '1. Add 18% IGV (From Base)' : '1. Agregar IGV (18% sobre Base Imponible)'}
          </button>
          <button
            type="button"
            onClick={() => setMode('extract')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'extract'
                ? 'bg-white dark:bg-zinc-900 text-[#234968] dark:text-[#5d95b3] shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isEn ? '2. Extract IGV (From Total)' : '2. Desglosar IGV (Calcular Base desde Total)'}
          </button>
        </div>

        {/* Inputs & Instant Breakdown Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {mode === 'add' ? 'Monto Base Imponible (Subtotal S/)' : 'Monto Total Facturado (S/)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
                  S/
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all tabular-nums"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[100, 500, 750, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val.toString())}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  S/ {val}
                </button>
              ))}
            </div>

            {/* Detraction Selector */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                {isEn ? 'Sunat SPOT Detraction Rate' : 'Régimen de Detracciones SPOT (SUNAT)'}
              </label>
              <select
                value={detractionType}
                onChange={(e) => setDetractionType(e.target.value as DetractionRateType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] transition-all cursor-pointer"
              >
                {DETRACTION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                {result.totalAmount <= SPOT_THRESHOLD_PEN ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Importe menor o igual a S/ 700: Por ley no aplica depósito de detracción.
                  </span>
                ) : (
                  <span>
                    Aplica para operaciones sujetas al SPOT que superan S/ {SPOT_THRESHOLD_PEN}.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {isEn ? 'Invoice Breakdown' : 'Comprobante de Pago'}
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy Breakdown' : 'Copiar Desglose')}</span>
              </button>
            </div>

            {/* Breakdown lines */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Base Imponible (Subtotal):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                  S/ {result.baseAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">IGV (18%):</span>
                <span className="font-mono font-bold text-[#234968] dark:text-[#5d95b3] text-sm tabular-nums">
                  + S/ {result.igvAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] border border-[#b7d2e0] dark:border-[#254157]">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Importe Total Facturado:</span>
                <span className="font-mono font-extrabold text-[#1c384a] dark:text-[#5d95b3] text-base tabular-nums">
                  S/ {result.totalAmount.toFixed(2)}
                </span>
              </div>

              {result.appliesDetraction && (
                <>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Detracción SPOT ({(result.detractionRate * 100).toFixed(0)}% BN):</span>
                    </div>
                    <span className="font-mono font-bold text-rose-700 dark:text-rose-400 text-sm tabular-nums">
                      - S/ {result.detractionAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Neto a Pagar / Cobrar al Proveedor:</span>
                    </div>
                    <span className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-base tabular-nums">
                      S/ {result.netPayableAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KaTeX Mathematical Proof Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5d95b3]">
            Transparencia Matemática
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            📐 Ecuación Canónica y Sustitución del IGV
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            Fórmula oficial de la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT):
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
            Fórmula Formal
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

      <Toast message={isEn ? 'Copied to clipboard' : '¡Desglose copiado al portapapeles!'} isVisible={copied} />
    </div>
  );
};
