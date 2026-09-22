import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('common.backToTools')}</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('termsPage.title')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              {t('termsPage.subtitle')}
            </p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('termsPage.s1Title')}
          </h2>
          <p>
            {t('termsPage.s1P1')}
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('termsPage.s2Title')}
          </h2>
          <p>
            {t('termsPage.s2P1')}
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {t('termsPage.s2P2')}
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('termsPage.s3Title')}
          </h2>
          <p>
            {t('termsPage.s3P1')}
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('termsPage.s4Title')}
          </h2>
          <p>
            {t('termsPage.s4P1')}
          </p>
        </section>
      </div>
    </main>
  );
};
