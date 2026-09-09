import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3] border border-[#b7d2e0] dark:border-[#254157] flex items-center justify-center mb-4">
        <Calculator className="w-6 h-6" />
      </div>
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#234968] dark:text-[#5d95b3]">
        Error 404
      </span>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
        Página no encontrada
      </h1>
      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
        La herramienta o ruta que buscas no existe o ha sido reubicada.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#234968] hover:bg-[#1a374e] text-white rounded-md text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Ir al inicio</span>
      </Link>
    </main>
  );
};
