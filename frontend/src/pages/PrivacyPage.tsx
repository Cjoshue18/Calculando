import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234968] dark:text-[#5d95b3] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a las herramientas</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3] border border-[#b7d2e0] dark:border-[#254157]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Términos y Condiciones
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Calculando · Herramientas de cálculo rápido y privado
            </p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            1. Procesamiento 100% Local y Privacidad
          </h2>
          <p>
            Calculando opera bajo un modelo de procesamiento <strong>100% en el cliente</strong>. Todas las operaciones aritméticas, notas, promedios y datos introducidos en los formularios se procesan únicamente en la memoria local de tu navegador.
          </p>
          <p className="font-semibold text-slate-800 dark:text-zinc-200">
            Nada se guarda en servidores externos ni se transmite a terceros. Tus datos se mantienen en todo momento exclusivamente en tu dispositivo.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            2. Uso de Almacenamiento Local (Local Storage)
          </h2>
          <p>
            La aplicación utiliza la memoria local de tu navegador exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
            <li>Recordar tu preferencia de tema visual (modo claro / modo oscuro).</li>
            <li>Recordar tu preferencia de idioma (Español / Inglés).</li>
            <li>Almacenar en tu propio equipo el historial de tus últimos cálculos realizados, el cual puedes eliminar en cualquier momento pulsando "Limpiar historial".</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            3. Términos de Uso y Exención de Responsabilidad
          </h2>
          <p>
            Las calculadoras proveen estimaciones y referencias técnicas basadas en fórmulas matemáticas estándar. Los resultados deben contrastarse siempre con los sílabos oficiales, reglamentos universitarios y cronogramas bancarios correspondientes a cada caso.
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            El servicio se suministra tal cual, sin garantías de ningún tipo sobre la adecuación a casos particulares no estandarizados.
          </p>
        </section>
      </div>
    </main>
  );
};

