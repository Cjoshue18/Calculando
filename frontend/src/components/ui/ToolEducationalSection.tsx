import { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, CheckCircle2, FileText } from 'lucide-react';
import { FAQItem } from '@/components/seo/SEOHead';

export interface EducationalSectionProps {
  badge?: string;
  title: string;
  subtitle: string;
  regulatoryFramework: {
    title: string;
    description: string;
    points: string[];
  };
  workedExample: {
    title: string;
    scenario: string;
    steps: {
      label: string;
      detail: string;
    }[];
    conclusion: string;
  };
  faqs: FAQItem[];
}

export const ToolEducationalSection: React.FC<EducationalSectionProps> = ({
  badge = 'Guía y Metodología',
  title,
  subtitle,
  regulatoryFramework,
  workedExample,
  faqs,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="mt-10 space-y-8 border-t border-slate-200 dark:border-zinc-800 pt-8">
      {/* Section Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3] text-xs font-mono font-semibold tracking-wide uppercase mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Grid: Regulatory Context + Worked Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regulatory & Conceptual Framework Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-md bg-[#f0f6f9] dark:bg-[#13222d] text-[#234968] dark:text-[#5d95b3]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {regulatoryFramework.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
              {regulatoryFramework.description}
            </p>
            <ul className="space-y-2.5">
              {regulatoryFramework.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Worked Example Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {workedExample.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mb-3 font-mono bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-md border border-slate-100 dark:border-zinc-800">
              {workedExample.scenario}
            </p>
            <div className="space-y-2 mb-4">
              {workedExample.steps.map((step, idx) => (
                <div key={idx} className="text-xs border-l-2 border-[#5d95b3] pl-3 py-1">
                  <span className="font-semibold text-slate-900 dark:text-white">{step.label}: </span>
                  <span className="text-slate-600 dark:text-zinc-300">{step.detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-[#f0f6f9] dark:bg-[#13222d] border border-[#b7d2e0] dark:border-[#254157] rounded-md text-xs font-semibold text-[#1c384a] dark:text-[#a0c5d9]">
            {workedExample.conclusion}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-md bg-slate-100 dark:bg-zinc-800 text-[#234968] dark:text-[#5d95b3]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Preguntas Frecuentes
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Respuestas directas a las dudas más comunes sobre este cálculo.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-xs sm:text-sm text-slate-800 dark:text-zinc-200 hover:text-[#234968] dark:hover:text-[#5d95b3] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#234968] dark:text-[#5d95b3]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed pl-1 pr-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
