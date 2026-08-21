import React from 'react';
import { X, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
  children: React.ReactNode;
}

export function FilterDrawer({ isOpen, onClose, onApply, onReset, title = 'Filters', children }: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-card shadow-xl z-50 flex flex-col border-l border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-primary" /> {title}
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-card-foreground">
          {children}
        </div>
        
        <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
          <Button variant="outline" onClick={onReset} className="bg-background hover:bg-muted text-foreground">Reset</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onApply}>Apply Filters</Button>
        </div>
      </div>
    </>
  );
}

export function QuickFilters({ filters, activeFilter, onSelect }: { filters: string[], activeFilter: string, onSelect: (f: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeFilter === f ? 'bg-[#2D3E2C] dark:bg-[#E4FD97] text-white dark:text-[#2D3E2C] border-[#2D3E2C] dark:border-[#E4FD97]' : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
