import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { VerificationTable } from '../components/VerificationTable';
import { DUMMY_VERIFICATIONS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Search, Filter, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VerificationDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Entry Verification" 
          description="Monitor real-time candidate check-ins and center occupancy." 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/company/entry-verification/history">
              View Audit History
            </Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
            <Link to="/company/entry-verification/check-in">
              <ScanLine className="w-4 h-4 mr-2" />
              Check-In Candidate
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-slate-200" />
          <p className="text-sm font-medium text-slate-500">Total Assigned (NY-01)</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">450</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          <p className="text-sm font-medium text-slate-500">Verified & Inside</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">210</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          <p className="text-sm font-medium text-slate-500">Pending Arrival</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">235</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
          <p className="text-sm font-medium text-slate-500">Exceptions (Hold/Reject)</p>
          <p className="text-2xl font-bold text-red-600 mt-1">5</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search candidates, app no, center..." className="pl-9 bg-white" />
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-white">
          <Filter className="w-4 h-4 mr-2 text-slate-500" />
          Filters
        </Button>
      </div>

      <VerificationTable verifications={DUMMY_VERIFICATIONS} />
    </div>
  );
}
