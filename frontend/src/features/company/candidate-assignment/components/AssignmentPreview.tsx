import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { FileCheck, Users, MapPin, Building2, Calendar } from 'lucide-react';

export function AssignmentPreview() {
  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-start gap-3">
        <FileCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-emerald-900">Ready to Assign</h4>
          <p className="text-sm text-emerald-700 mt-1">
            Please review the assignment details below before confirming. This action will allocate seats for the selected candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Exam Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div>
              <span className="block text-xs text-slate-500 font-medium">EXAM</span>
              <span className="font-medium text-slate-900">EX-2026-SPRING</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">SHIFT</span>
              <span className="font-medium text-slate-900">SHIFT-M (Morning)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div>
              <span className="block text-xs text-slate-500 font-medium">CENTER</span>
              <span className="font-medium text-slate-900">CTR-NY-01</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">BRANCH</span>
              <span className="font-medium text-slate-900">NY Main Campus</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Allocation Summary
            </CardTitle>
            <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              <Users className="w-4 h-4" />
              150 Candidates
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-600 text-sm">Target Room</span>
              <span className="font-medium text-slate-900">Room 101</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-600 text-sm">Allocation Strategy</span>
              <span className="font-medium text-slate-900">Automatic Sequential</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-600 text-sm">Total Seats Required</span>
              <span className="font-medium text-slate-900">150</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
