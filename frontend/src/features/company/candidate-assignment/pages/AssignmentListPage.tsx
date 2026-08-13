import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AssignmentTable } from '../components/AssignmentTable';
import { DUMMY_ASSIGNMENTS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Search, Plus, Filter, Upload, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AssignmentListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Candidate Assignments" 
          description="Manage and track room and seat allocations for candidates." 
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/company/candidate-assignment/import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/company/candidate-assignment/bulk">
              <Layers className="w-4 h-4 mr-2" />
              Bulk Assign
            </Link>
          </Button>
          <Button asChild>
            <Link to="/company/candidate-assignment/create">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Assigned</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">2,450</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending Assignment</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">150</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Centers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Assignment Errors</p>
          <p className="text-2xl font-bold text-red-600 mt-1">0</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search candidates, application no..." className="pl-9 bg-white" />
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-white">
          <Filter className="w-4 h-4 mr-2 text-slate-500" />
          Filters
        </Button>
      </div>

      <AssignmentTable assignments={DUMMY_ASSIGNMENTS} />
    </div>
  );
}
