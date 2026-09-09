import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  Sun, 
  Moon, 
  Globe, 
  Heart, 
  ChevronDown, 
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { toolRegistry } from '@/core/registry/toolRegistry';
import { SupportModal } from '@/components/support/SupportModal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNavCategory, setActiveNavCategory] = useState<string>('academic');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on navigation
  React.useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="sticky top-3 z-50 w-full px-4 sm:px-6 pointer-events-none">
        <header className="max-w-5xl mx-auto h-[52px] bg-zinc-950 text-white rounded-full px-4 sm:px-5 flex items-center justify-between shadow-lg shadow-black/10 border border-zinc-800 pointer-events-auto transition-all">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-[#5d95b3] text-zinc-950 flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
                <Calculator className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
              </div>
              <span className="font-bold tracking-[-0.03em] text-base text-white">
                Calculando<sup className="text-[10px] text-[#5d95b3] font-mono ml-0.5 font-bold">2</sup>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium tracking-tight">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  location.pathname === '/'
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Inicio
              </Link>

              {/* Tools Cascading Dropdown (Click Only) */}
              <div 
                ref={dropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                    dropdownOpen ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Herramientas</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-[440px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-100 flex">
                    {/* Left Column: Categories */}
                    <div className="w-48 bg-zinc-900/90 border-r border-zinc-800 p-2 space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Categorías
                      </div>
                      {[
                        { id: 'academic', label: 'Académico' },
                        { id: 'finance', label: 'Finanzas' },
                        { id: 'time', label: 'Tiempo & Horas' },
                        { id: 'dev', label: 'Desarrolladores' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveNavCategory(cat.id)}
                          onClick={() => setActiveNavCategory(cat.id)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            activeNavCategory === cat.id
                              ? 'bg-zinc-800 text-white text-[#5d95b3]'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="text-zinc-600 text-[10px]">›</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Column: Tools in Active Category */}
                    <div className="flex-1 p-2 space-y-1 bg-zinc-950">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-[#5d95b3] uppercase tracking-wider">
                        Herramientas
                      </div>
                      {toolRegistry
                        .filter((t) => t.category === activeNavCategory)
                        .map((tool) => {
                          const IconComponent = tool.icon;
                          const name = language === 'en' ? tool.defaultNameEn : tool.defaultNameEs;

                          if (tool.isAvailable) {
                            return (
                              <Link
                                key={tool.id}
                                to={tool.slug}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors group"
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-3.5 h-3.5 text-[#5d95b3]" />
                                  <span className="font-medium group-hover:text-white">{name}</span>
                                </div>
                                {tool.badge && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                                    {tool.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={tool.id}
                              className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-zinc-500 opacity-80"
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-3.5 h-3.5 text-zinc-600" />
                                <span>{name}</span>
                              </div>
                              {tool.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-zinc-900 text-zinc-500 border border-zinc-800">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Cambiar idioma (ES/EN)"
              className="px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full border border-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3 h-3 text-[#5d95b3]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Mobile Support Heart Button (Right next to Language Toggle) */}
            <button
              onClick={() => setSupportModalOpen(true)}
              title={t('common.support')}
              className="sm:hidden p-1.5 text-rose-400 hover:text-rose-300 hover:bg-zinc-800 rounded-full border border-zinc-800 flex items-center justify-center transition-colors"
              aria-label={t('common.support')}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? t('common.themeLight') : t('common.themeDark')}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full border border-zinc-800 transition-all duration-200 transform active:scale-90 hover:scale-105 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-200 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Support CTA Button (Quantum² pill button style) */}
            <button
              onClick={() => setSupportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5d95b3] hover:bg-[#4d83a0] text-zinc-950 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-zinc-950/30" />
              <span>{t('common.support')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu (Quantum² style) */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-sm ml-auto mt-2 p-3 bg-zinc-950 text-white border border-zinc-800 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-top-2 duration-150">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Inicio
            </Link>
            <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto pr-1">
              {[
                { id: 'academic', label: 'Académico' },
                { id: 'finance', label: 'Finanzas' },
                { id: 'time', label: 'Tiempo & Horas' },
                { id: 'dev', label: 'Desarrolladores' },
              ].map((cat) => {
                const toolsInCat = toolRegistry.filter((t) => t.category === cat.id);
                if (toolsInCat.length === 0) return null;
                return (
                  <div key={cat.id} className="pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#5d95b3] px-2 py-0.5">
                      {cat.label}
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {toolsInCat.map((tool) => {
                        const name = language === 'en' ? tool.defaultNameEn : tool.defaultNameEs;
                        if (tool.isAvailable) {
                          return (
                            <Link
                              key={tool.id}
                              to={tool.slug}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900 rounded-lg"
                            >
                              <span>{name}</span>
                              {tool.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono">
                                  {tool.badge}
                                </span>
                              )}
                            </Link>
                          );
                        }
                        return (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-500 opacity-70"
                          >
                            <span>{name}</span>
                            {tool.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-900 text-zinc-500 font-mono border border-zinc-800">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSupportModalOpen(true);
              }}
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-[#5d95b3] text-zinc-950 rounded-full text-xs font-bold"
            >
              <Heart className="w-3.5 h-3.5 fill-zinc-950/20" />
              <span>{t('common.support')}</span>
            </button>
          </div>
        )}
      </div>

      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </>
  );
};
