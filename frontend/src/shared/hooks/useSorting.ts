import { useState, useCallback } from 'react';
import type { SortState } from '../types';

export function useSorting(initialSort?: SortState[]) {
  const [sorting, setSorting] = useState<SortState[]>(initialSort || []);

  const toggleSort = useCallback((id: string, multi = false) => {
    setSorting(prev => {
      const existingIdx = prev.findIndex(s => s.id === id);
      
      let nextState = [...prev];
      if (!multi) {
        nextState = [];
      }

      if (existingIdx >= 0) {
        if (prev[existingIdx].desc) {
          if (!multi) return [];
          nextState = prev.filter(s => s.id !== id);
        } else {
          nextState = multi ? prev.map((s, i) => i === existingIdx ? { ...s, desc: true } : s) : [{ id, desc: true }];
        }
      } else {
        nextState = [...nextState, { id, desc: false }];
      }
      return nextState;
    });
  }, []);

  const clearSorting = useCallback(() => {
    setSorting([]);
  }, []);

  return {
    sorting,
    setSorting,
    toggleSort,
    clearSorting,
  };
}
