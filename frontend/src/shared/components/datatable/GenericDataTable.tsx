import React, { useState } from 'react';
import type { TableColumn } from '../../types';
import { ChevronDown, ChevronRight, ArrowUpDown } from 'lucide-react';

interface GenericDataTableProps<TData> {
  columns: TableColumn<TData>[];
  data: TData[];
  keyExtractor: (item: TData) => string;
  enableSelection?: boolean;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAll?: () => void;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  expandable?: boolean;
  renderExpandedRow?: (item: TData) => React.ReactNode;
  onSort?: (id: string) => void;
}

export function GenericDataTable<TData>({
  columns,
  data,
  keyExtractor,
  enableSelection,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  isAllSelected,
  isSomeSelected,
  expandable,
  renderExpandedRow,
  onSort,
}: GenericDataTableProps<TData>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-x-auto">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead className="bg-muted border-b border-border text-foreground">
          <tr>
            {enableSelection && (
              <th className="px-4 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isSomeSelected && !isAllSelected || false;
                  }}
                  onChange={onToggleAll}
                  className="rounded border-border text-primary focus:ring-primary accent-primary bg-background"
                />
              </th>
            )}
            {expandable && <th className="px-4 py-3 w-12"></th>}
            {columns.map(col => (
              <th key={col.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.enableSorting && (
                    <button onClick={() => onSort?.(col.id)} className="p-1 hover:bg-muted/80 rounded text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {!data.length ? (
            <tr>
              <td colSpan={columns.length + (enableSelection ? 1 : 0) + (expandable ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.has(id);
              const isExpanded = expandedRows.has(id);

              return (
                <React.Fragment key={id}>
                  <tr className={`hover:bg-muted transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                    {enableSelection && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelection?.(id)}
                          className="rounded border-border text-primary focus:ring-primary accent-primary bg-background"
                        />
                      </td>
                    )}
                    {expandable && (
                      <td className="px-4 py-3">
                        <button onClick={() => toggleExpand(id)} className="p-1 hover:bg-muted/80 rounded text-muted-foreground">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.id} className="px-4 py-3">
                        {col.cell ? col.cell({ row: item }) : (col.accessorKey ? String(item[col.accessorKey] || '') : '')}
                      </td>
                    ))}
                  </tr>
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr className="bg-muted/50 border-t border-border">
                      <td colSpan={columns.length + (enableSelection ? 1 : 0) + 1} className="p-4">
                        {renderExpandedRow(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
