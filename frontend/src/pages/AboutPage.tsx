import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Calculator, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Link */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('common.backToTools')}</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 sm:p-10 space-y-8 shadow-xs">
        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('aboutPage.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            {t('aboutPage.subtitle')}
          </p>
        </div>

        {/* Section 1: Propósito del Proyecto */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#234968] dark:text-[#5d95b3] font-bold text-sm">
            <Zap className="w-4 h-4" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('aboutPage.missionTitle')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {t('aboutPage.missionText')}
          </p>
        </section>

        {/* Section 2: Privacidad y Procesamiento Local */}
        <section className="space-y-3 p-5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('aboutPage.privacyTitle')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {t('aboutPage.privacyText')}
          </p>
        </section>

        {/* Section 3: Rigor Matemático */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#234968] dark:text-[#5d95b3] font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('aboutPage.accuracyTitle')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {t('aboutPage.accuracyText')}
          </p>
        </section>

        {/* Section 4: Acceso Libre */}
        <section className="space-y-3 border-t border-slate-200 dark:border-zinc-800 pt-6">
          <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('aboutPage.freeUsageTitle')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {t('aboutPage.freeUsageText')}
          </p>
        </section>
      </div>
    </main>
  );
};
