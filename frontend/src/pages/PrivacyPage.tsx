import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('common.backToTools')}</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('privacyPage.title')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              {t('privacyPage.subtitle')}
            </p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('privacyPage.s1Title')}
          </h2>
          <p>
            {t('privacyPage.s1P1')}
          </p>
          <p className="font-semibold text-slate-800 dark:text-zinc-200">
            {t('privacyPage.s1P2')}
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('privacyPage.s2Title')}
          </h2>
          <p>
            {t('privacyPage.s2P1')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
            <li>{t('privacyPage.s2Li1')}</li>
            <li>{language === 'en' ? 'Remember your language preference (Spanish / English).' : 'Recordar tu preferencia de idioma (Español / Inglés).'}</li>
            <li>{t('privacyPage.s2Li2')}</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {language === 'en' ? '3. Terms of Use & Disclaimer' : '3. Términos de Uso y Exención de Responsabilidad'}
          </h2>
          <p>
            {language === 'en' 
              ? 'Calculators provide technical estimations and references based on formal math formulas. Results should always be cross-checked with official syllabi, university regulations, or financial schedules.'
              : 'Las calculadoras proveen estimaciones y referencias técnicas basadas en fórmulas matemáticas estándar. Los resultados deben contrastarse siempre con los sílabos oficiales, reglamentos universitarios y cronogramas bancarios correspondientes a cada caso.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {language === 'en'
              ? 'The service is provided as-is without warranties of any kind regarding suitability for non-standardized individual edge cases.'
              : 'El servicio se suministra tal cual, sin garantías de ningún tipo sobre la adecuación a casos particulares no estandarizados.'}
          </p>
        </section>
      </div>
    </main>
  );
};

