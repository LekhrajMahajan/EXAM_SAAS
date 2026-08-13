import { useState, useCallback } from 'react';

export function usePagination(initialPageSize = 10) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPagination = useCallback(() => {
    setPageIndex(0);
  }, []);

  return {
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetPagination,
  };
}
