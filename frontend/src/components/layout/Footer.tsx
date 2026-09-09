import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold tracking-tight">
              <div className="w-6 h-6 rounded-md bg-[#234968] text-white flex items-center justify-center">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span className="text-base">Calculando</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Herramientas de cálculo rápido y esencial para el día a día. Desarrollado con precisión matemática, cero rodeos y máxima velocidad de ejecución en tu navegador.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 dark:text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cálculos en memoria 100% privados (tus notas y datos no salen de tu dispositivo).</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
              Herramientas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/calculadora-nota-final" className="hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors">
                  Calculadora de Nota Final
                </Link>
              </li>
              <li>
                <Link to="/promedio-ponderado-acumulado" className="hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors">
                  Promedio Ponderado
                </Link>
              </li>
              <li>
                <Link to="/sumador-horas-minutos" className="hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors">
                  Sumador de Horas
                </Link>
              </li>
              <li>
                <Link to="/calculadora-tea-tcea" className="hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors">
                  Simulador TEA / Préstamos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/terminos-condiciones" className="hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors">
                  {t('common.termsAndConditions')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-zinc-500">
          <div>
            © {new Date().getFullYear()} Calculando. {t('common.mitLicense')}.
          </div>
          <div>
            {t('common.madeWith')}
          </div>
        </div>
      </div>
    </footer>
  );
};
