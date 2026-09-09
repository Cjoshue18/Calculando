import React, { useState } from 'react';
import { X, Heart, ExternalLink, Coffee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [tab, setTab] = useState<'bmc' | 'peru'>('bmc');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden cursor-default transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Coffee className="w-4 h-4" />
            </div>
            <span>{t('supportModal.title')}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Buy Me a Coffee first, then Yape / Plin */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-semibold tracking-wider">
          <button
            onClick={() => setTab('bmc')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'bmc'
                ? 'border-[#234968] text-[#234968] dark:border-[#5d95b3] dark:text-[#5d95b3] bg-white dark:bg-zinc-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            <span>{t('supportModal.bmcTab')}</span>
          </button>
          <button
            onClick={() => setTab('peru')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'peru'
                ? 'border-[#234968] text-[#234968] dark:border-[#5d95b3] dark:text-[#5d95b3] bg-white dark:bg-zinc-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            <span>{t('supportModal.peruTab')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          {tab === 'bmc' ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                {t('supportModal.bmcDesc')}
              </p>

              {/* Real Buy Me a Coffee QR Code */}
              <div className="mx-auto w-56 p-4 bg-white border border-slate-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <img 
                  src="/qr-code.webp" 
                  alt="Código QR Buy Me a Coffee" 
                  className="w-48 h-48 object-contain rounded-lg"
                />
                <span className="text-[11px] font-semibold text-slate-600 mt-2.5">
                  {language === 'en' ? 'Scan with your phone camera' : 'Escanea con la cámara de tu celular'}
                </span>
              </div>

              {/* Alternative Direct Button without broken icon */}
              <div className="pt-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  {language === 'en' ? 'Prefer direct access without scanning?' : '¿Prefieres acceder directamente sin escanear?'}
                </span>

                <a
                  href="https://buymeacoffee.com/cjoshue18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFDD00] hover:bg-[#ffe733] text-black font-bold text-sm tracking-tight border border-black/20 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <span>Buy me a coffee</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                {t('supportModal.peruDesc')}
              </p>

              {/* Real Yape / Plin QR Code */}
              <div className="mx-auto w-56 p-4 bg-white border border-slate-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <img 
                  src="/qr-code-2.webp" 
                  alt="Código QR Yape o Plin" 
                  className="w-48 h-48 object-contain rounded-lg"
                />
                <span className="text-[11px] font-semibold text-slate-600 mt-2.5">
                  {language === 'en' ? 'Scan with Yape or Plin' : 'Escanea con Yape o Plin'}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {language === 'en' ? 'Any voluntary contribution is deeply appreciated.' : 'Cualquier contribución voluntaria es muy apreciada.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-zinc-950/80 border-t border-slate-200 dark:border-zinc-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>{t('supportModal.thankYou')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
