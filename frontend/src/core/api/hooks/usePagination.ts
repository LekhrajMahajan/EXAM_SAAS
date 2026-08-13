import { useState, useCallback } from 'react';
import type { StandardQueryParams } from '../types/request.types';

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  const getPaginationParams = useCallback((): Partial<StandardQueryParams> => ({
    page,
    limit,
  }), [page, limit]);

  return {
    page,
    limit,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    getPaginationParams,
  };
}

export function useFilters<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [search, setSearch] = useState('');

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearch('');
  }, [initialFilters]);

  const getFilterParams = useCallback((): Partial<StandardQueryParams> => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      ...activeFilters,
      ...(search ? { search } : {}),
    };
  }, [filters, search]);

  return {
    filters,
    search,
    setSearch,
    updateFilter,
    clearFilters,
    getFilterParams,
  };
}
