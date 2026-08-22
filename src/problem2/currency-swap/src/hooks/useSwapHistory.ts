import { useCallback, useEffect, useState } from 'react';
import type { ISwapHistoryItem } from '@/types/currency';

const STORAGE_KEY = 'currency-swap-history';
const MAX_ENTRIES = 20;

const readStoredHistory = (): ISwapHistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ISwapHistoryItem[]) : [];
  } catch {
    return [];
  }
};

export const useSwapHistory = () => {
  const [history, setHistory] = useState<ISwapHistoryItem[]>(readStoredHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback(
    (entry: Omit<ISwapHistoryItem, 'id' | 'timestamp'>) => {
      setHistory((prev) =>
        [
          { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
          ...prev,
        ].slice(0, MAX_ENTRIES),
      );
    },
    [],
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, clearHistory };
};
