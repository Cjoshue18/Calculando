import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] flex items-center justify-center mb-4">
        <Calculator className="w-6 h-6" />
      </div>
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#234968] dark:text-[#5d95b3]">
        Error 404
      </span>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
        {language === 'en' ? 'Page Not Found' : 'Página no encontrada'}
      </h1>
      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
        {language === 'en'
          ? 'The tool or page you are looking for does not exist or has been relocated.'
          : 'La herramienta o ruta que buscas no existe o ha sido reubicada.'}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#234968] hover:bg-[#1a374e] text-white rounded-md text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'en' ? 'Back to home' : 'Ir al inicio'}</span>
      </Link>
    </main>
  );
};
