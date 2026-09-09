import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem<T = unknown> {
  id: string;
  timestamp: number;
  summary: string;
  data: T;
}

export function useLocalStorageHistory<T>(toolKey: string, maxItems = 5) {
  const storageKey = `calculando-history-${toolKey}`;

  const [history, setHistory] = useState<HistoryItem<T>[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {
      // Ignore quota exceeded or storage disabled
    }
  }, [history, storageKey]);

  const addHistoryItem = useCallback((summary: string, data: T) => {
    setHistory(prev => {
      // Avoid duplicate consecutive entries with identical summary
      if (prev.length > 0 && prev[0].summary === summary) {
        return prev;
      }
      const newItem: HistoryItem<T> = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        summary,
        data,
      };
      return [newItem, ...prev.slice(0, maxItems - 1)];
    });
  }, [maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  return { history, addHistoryItem, clearHistory };
}
