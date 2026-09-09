import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { GoogleFollowBanner } from '@/components/support/GoogleFollowBanner';

interface ToolLayoutProps {
  category: string;
  toolName: string;
  children: React.ReactNode;
  historySlot?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  category,
  toolName,
  children,
  historySlot,
}) => {
  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumbs for SEO */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
          <li>
            <Link to="/" className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </li>
          <li className="capitalize font-medium text-slate-600 dark:text-zinc-300">
            {category}
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </li>
          <li className="font-semibold text-[#234968] dark:text-[#5d95b3] truncate" aria-current="page">
            {toolName}
          </li>
        </ol>
      </nav>

      {/* Main Grid: Tool Area + Optional Sidebar / History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Tool Content (Above the Fold) */}
        <div className={historySlot ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {children}

          {/* Growth Hack Retention Banner */}
          <GoogleFollowBanner />

          {/* Semantic Ad Slot (Ready for Google AdSense in compliance with AdSense guidelines) */}
          <div 
            id="adsense-slot-tool-bottom" 
            className="w-full min-h-[90px] p-4 bg-slate-100/50 dark:bg-zinc-900/40 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs text-slate-400 dark:text-zinc-600"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 opacity-50" />
              <span className="font-mono uppercase tracking-widest text-[10px]">Espacio reservado para AdSense</span>
            </div>
          </div>
        </div>

        {/* History / Recent Calculations Drawer */}
        {historySlot && (
          <aside className="lg:col-span-4 space-y-6">
            {historySlot}
          </aside>
        )}
      </div>
    </main>
  );
};
