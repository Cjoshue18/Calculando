import React from 'react';
import { MathView } from './MathView';

// Compound Component Pattern for Tool Layout consistency

interface ToolCardRootProps {
  children: React.ReactNode;
  className?: string;
}

const Root: React.FC<ToolCardRootProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-cal-card transition-colors duration-150 ${className}`}>
      {children}
    </div>
  );
};

interface ToolCardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const Header: React.FC<ToolCardHeaderProps> = ({ icon, title, description, actions }) => {
  return (
    <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 rounded-md bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3] border border-[#b7d2e0] dark:border-[#254157]">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 self-end sm:self-center">{actions}</div>}
    </div>
  );
};

interface ToolCardInputsProps {
  children: React.ReactNode;
  className?: string;
}

const Inputs: React.FC<ToolCardInputsProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

interface ToolCardResultProps {
  children: React.ReactNode;
  className?: string;
}

const Result: React.FC<ToolCardResultProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 sm:p-6 bg-slate-50 dark:bg-zinc-950/70 border-t border-slate-200 dark:border-zinc-800 ${className}`}>
      {children}
    </div>
  );
};

interface ToolCardFormulaProps {
  title?: string;
  formula?: string;
  latex?: string;
  substitutionLatex?: string;
  steps?: { label: string; value: string }[];
  explanation?: string;
}

const Formula: React.FC<ToolCardFormulaProps> = ({
  title = 'Fórmula y sustento matemático',
  formula,
  latex,
  substitutionLatex,
  steps,
  explanation,
}) => {
  return (
    <div className="mt-6 border-t border-slate-200 dark:border-zinc-800 pt-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
        {title}
      </h3>
      {explanation && (
        <p className="text-xs text-slate-600 dark:text-zinc-400 mb-3">
          {explanation}
        </p>
      )}

      {/* LaTeX Formal Equation Card */}
      {latex && (
        <div className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-2xs mb-3">
          <div className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Ecuación Canónica
          </div>
          <MathView math={latex} className="text-[#234968] dark:text-[#5d95b3] text-lg font-medium" />
        </div>
      )}

      {/* LaTeX Substitution Card */}
      {substitutionLatex && (
        <div className="p-4 bg-[#f0f6f9]/80 dark:bg-[#13222d]/60 border border-[#b7d2e0] dark:border-[#254157] rounded-lg shadow-2xs mb-3">
          <div className="text-[10px] font-mono font-semibold text-[#234968] dark:text-[#5d95b3] uppercase tracking-wider mb-1">
            Sustitución de Valores Actuales
          </div>
          <MathView math={substitutionLatex} className="text-[#234968] dark:text-[#5d95b3] text-base font-semibold" />
        </div>
      )}

      {/* Plain formula fallback if no LaTeX provided */}
      {!latex && formula && (
        <div className="p-3 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md font-mono text-sm text-[#234968] dark:text-[#5d95b3] font-semibold overflow-x-auto">
          {formula}
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className="mt-3 space-y-1.5 font-mono text-xs text-slate-600 dark:text-zinc-400">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-zinc-800 pb-1">
              <span>{step.label}:</span>
              <span className="font-semibold text-slate-900 dark:text-zinc-200">{step.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ToolCard = {
  Root,
  Header,
  Inputs,
  Result,
  Formula,
};
