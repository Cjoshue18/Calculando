import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import { toolRegistry, ToolCategory } from '@/core/registry/toolRegistry';
import { useLanguage } from '@/context/LanguageContext';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = toolRegistry.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const name = language === 'en' ? tool.defaultNameEn : tool.defaultNameEs;
    const description = language === 'en' ? tool.defaultDescriptionEn : tool.defaultDescriptionEs;
    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: t('common.categories.all') },
    { id: 'academic', label: t('common.categories.academic') },
    { id: 'finance', label: t('common.categories.finance') },
    { id: 'time', label: t('common.categories.time') },
    { id: 'dev', label: t('common.categories.dev') },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* ══════════════════════════════════════════════════════
          1. HERO SECTION (FIGTREE TIGHT TRACKING)
         ══════════════════════════════════════════════════════ */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#234968] dark:bg-[#5d95b3] text-white dark:text-zinc-950 text-xs font-semibold tracking-tight shadow-xs mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5d95b3] dark:bg-zinc-950 animate-pulse" />
            <span>Hub de herramientas para el día a día</span>
          </div>

          {/* Two-Line Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-[-0.045em] leading-[1.08] text-balance">
            Cálculos matemáticos rápidos<br className="hidden sm:inline" />
            <span className="text-[#5d95b3]"> y sin rodeos técnicos.</span>
          </h1>

          {/* Subcopy */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-400 tracking-[-0.02em] max-w-2xl mx-auto leading-relaxed text-balance">
            De notas académicas a conversiones de tiempo y cálculos financieros.
            Máxima velocidad y privacidad absoluta directamente en tu navegador.
          </p>

          {/* Hero CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/calculadora-nota-final"
              className="px-6 py-3 bg-[#234968] hover:bg-[#1a374e] text-white rounded-full text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>Calcular nota final</span>
              <ArrowRight className="w-4 h-4 text-[#5d95b3]" />
            </Link>
            <a
              href="#catalogo"
              className="px-5 py-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 rounded-full text-sm font-medium tracking-tight transition-colors"
            >
              Ver catálogo de herramientas
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. ANIMATED BAND WITH CATALOG CONTROLS (SEARCH & FILTERS)
         ══════════════════════════════════════════════════════ */}
      <section id="catalogo" className="relative w-full">
        {/* Full-Bleed Animated Video Band */}
        <div className="relative w-full py-12 sm:py-16 bg-[#1c384a] overflow-hidden shadow-inner flex flex-col items-center justify-center">
          <video
            className="absolute inset-0 w-full h-full object-cover object-top opacity-60 pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125039_45a71f04-36dd-4620-99d8-7526316d439e.png"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125119_4963ddd4-c287-4044-b014-b68943cdd8bd.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c384a]/90 via-[#234968]/75 to-[#5d95b3]/85 mix-blend-multiply" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Controls in front of the animated band */}
          <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Catálogo Oficial de Herramientas
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-200">
              Selecciona la herramienta que necesitas. Todas se ejecutan en milisegundos en tu navegador.
            </p>

            {/* Search Bar on Band */}
            <div className="mt-6 max-w-lg mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs border border-white/20 dark:border-zinc-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#5d95b3] shadow-lg transition-all"
              />
            </div>

            {/* Category Filter Pills on Band */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white text-[#1c384a] shadow-md scale-105'
                      : 'bg-black/30 hover:bg-black/45 text-white/90 border border-white/15'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            3. THE PRESERVED 6-TOOL CATALOG GRID
           ══════════════════════════════════════════════════════ */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const name = language === 'en' ? tool.defaultNameEn : tool.defaultNameEs;
              const description = language === 'en' ? tool.defaultDescriptionEn : tool.defaultDescriptionEs;

              if (tool.isAvailable) {
                return (
                  <Link
                    key={tool.id}
                    to={tool.slug}
                    className="group p-5 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-xl hover:border-[#5d95b3] dark:hover:border-[#5d95b3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] group-hover:bg-[#234968] group-hover:text-white dark:group-hover:bg-[#5d95b3] dark:group-hover:text-zinc-950 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 font-semibold">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#234968] dark:group-hover:text-[#5d95b3] transition-colors">
                        {name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[#234968] dark:text-[#5d95b3]">
                      <span>Abrir calculadora</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={tool.id}
                  className="p-5 bg-white dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      {tool.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 font-medium">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                      {name}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    En desarrollo activo
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. USER-CENTRIC PILLARS
         ══════════════════════════════════════════════════════ */}
      <section className="border-t border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3] border border-[#b7d2e0] dark:border-[#254157] flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cero Latencia (100% Client-Side)
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Las fórmulas se computan en memoria en tu navegador con JavaScript puro. Sin pantallas de espera ni llamadas a servidores externos.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Privacidad Absoluta
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Tus notas, calificaciones o cálculos numéricos nunca viajan a bases de datos ni servicios de analítica. Todo reside en tu memoria RAM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
