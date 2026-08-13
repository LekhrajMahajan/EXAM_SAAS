import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function GenericPagination({ pageIndex, pageSize, totalCount, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select 
          value={pageSize} 
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 rounded-md border border-border bg-card px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span>per page</span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div>
          Showing {totalCount === 0 ? 0 : pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} records
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="px-2" onClick={() => onPageChange(0)} disabled={pageIndex === 0}>
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="px-2" onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-3 font-medium text-foreground">Page {pageIndex + 1} of {totalPages}</span>
          <Button variant="outline" size="sm" className="px-2" onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex >= totalPages - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="px-2" onClick={() => onPageChange(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
