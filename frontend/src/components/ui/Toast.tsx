import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-md shadow-lg border border-zinc-800 dark:border-zinc-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
};
