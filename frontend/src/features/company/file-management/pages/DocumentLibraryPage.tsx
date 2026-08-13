import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FILES } from '../utils/placeholder';
import { FileTable } from '../components/FileTable';
import { FileGrid } from '../components/FileGrid';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, LayoutGrid, List, Filter } from 'lucide-react';

export function DocumentLibraryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Library"
        description="Browse, search, and manage all uploaded files and documents."
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9 w-full" placeholder="Search by file name, category, or module..." />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
            <option value="">All Types</option>
            <option value="Image">Image</option>
            <option value="PDF">PDF</option>
            <option value="Document">Document</option>
            <option value="Spreadsheet">Spreadsheet</option>
          </select>
          <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
            <option value="">All Modules</option>
            <option value="Candidates">Candidates</option>
            <option value="Results">Results</option>
            <option value="Certificates">Certificates</option>
          </select>
          <Button variant="outline" className="bg-white">
            <Filter className="w-4 h-4 mr-2" /> More Filters
          </Button>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? <FileTable files={DUMMY_FILES} /> : <FileGrid files={DUMMY_FILES} />}
    </div>
  );
}
