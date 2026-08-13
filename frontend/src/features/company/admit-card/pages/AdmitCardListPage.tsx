import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AdmitCardTable } from '../components/AdmitCardTable';
import { DUMMY_ADMIT_CARDS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Search, Filter, Printer, FileOutput } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdmitCardListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Admit Cards" 
          description="Manage and generate admit cards for candidates." 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/company/admit-cards/history">
              History
            </Link>
          </Button>
          <Button asChild>
            <Link to="/company/admit-cards/generate">
              <Printer className="w-4 h-4 mr-2" />
              Generate Admit Cards
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Generated</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">2,450</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending Generation</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">150</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Downloaded</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,890</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Revoked</p>
          <p className="text-2xl font-bold text-red-600 mt-1">5</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by name, app no..." className="pl-9 bg-white" />
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-white">
          <Filter className="w-4 h-4 mr-2 text-slate-500" />
          Filters
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto">
          <FileOutput className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <AdmitCardTable admitCards={DUMMY_ADMIT_CARDS} />
    </div>
  );
}
