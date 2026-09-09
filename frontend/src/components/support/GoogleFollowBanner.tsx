import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const GoogleFollowBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="my-6 p-4 bg-gradient-to-r from-[#f0f6f9] to-[#e4eef4] dark:from-[#13222d] dark:to-zinc-900 border border-[#b7d2e0] dark:border-[#254157] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-[#234968] text-white shrink-0 mt-0.5 sm:mt-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {t('common.googleFollow')}
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
            {t('common.googleFollowSub')}
          </p>
        </div>
      </div>
      <a
        href="https://news.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700 rounded-md text-xs font-semibold shadow-xs transition-colors shrink-0"
      >
        <span>{t('common.followBtn')}</span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
      </a>
    </div>
  );
};
