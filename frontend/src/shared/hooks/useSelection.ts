import { useState, useCallback, useMemo } from 'react';

export function useSelection<T>(items: T[], keyFn: (item: T) => string) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(keyFn)));
    }
  }, [items, selectedIds.size, keyFn]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useMemo(() => items.length > 0 && selectedIds.size === items.length, [items.length, selectedIds.size]);
  const isSomeSelected = useMemo(() => selectedIds.size > 0 && selectedIds.size < items.length, [items.length, selectedIds.size]);

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isAllSelected,
    isSomeSelected,
  };
}
