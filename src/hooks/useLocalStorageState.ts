import { useState, useEffect } from 'react';

/**
 * useLocalStorageState — универсальный хук для хранения состояния в localStorage
 * @param key Ключ в localStorage
 * @param initial Начальное значение
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initial;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);
  return [state, setState] as const;
}
