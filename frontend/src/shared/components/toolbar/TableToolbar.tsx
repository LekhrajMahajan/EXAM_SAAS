import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw, Download, Upload, Filter, Settings2 } from 'lucide-react';

interface ToolbarProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onFilterToggle?: () => void;
  onColumnSettings?: () => void;
  children?: React.ReactNode;
}

export function TableToolbar({ onRefresh, onExport, onImport, onFilterToggle, onColumnSettings, children }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
      <div className="flex items-center gap-2 flex-1">
        {children}
      </div>
      <div className="flex items-center gap-2">
        {onFilterToggle && (
          <Button variant="outline" size="sm" onClick={onFilterToggle} className="bg-white">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        )}
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} className="bg-white px-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="bg-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        )}
        {onImport && (
          <Button variant="outline" size="sm" onClick={onImport} className="bg-white">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
        )}
        {onColumnSettings && (
          <Button variant="outline" size="sm" onClick={onColumnSettings} className="bg-white px-2">
            <Settings2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
