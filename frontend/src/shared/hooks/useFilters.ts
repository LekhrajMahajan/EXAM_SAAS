import { useState, useCallback } from 'react';
import type { FilterState } from '../types';

export function useFilters(initialFilters: FilterState[] = []) {
  const [filters, setFilters] = useState<FilterState[]>(initialFilters);

  const setFilter = useCallback((id: string, value: unknown) => {
    setFilters(prev => {
      const existing = prev.find(f => f.id === id);
      if (existing) {
        if (value === undefined || value === null || value === '') {
          return prev.filter(f => f.id !== id);
        }
        return prev.map(f => f.id === id ? { ...f, value } : f);
      }
      return [...prev, { id, value }];
    });
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
  };
}
