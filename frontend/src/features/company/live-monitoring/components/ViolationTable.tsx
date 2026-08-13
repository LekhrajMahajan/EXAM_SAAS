import React from 'react';
import type { ViolationRecord, ViolationSeverity } from '../types';
import { cn } from '@/utils/cn';
import { Button } from '@/shared/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface ViolationTableProps {
  violations: ViolationRecord[];
}

export function ViolationTable({ violations }: ViolationTableProps) {
  
  const getSeverityBadge = (severity: ViolationSeverity) => {
    switch(severity) {
      case 'Critical': return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider border border-red-200">Critical</span>;
      case 'High': return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider border border-orange-200">High</span>;
      case 'Medium': return <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">Medium</span>;
      case 'Low': return <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Unresolved': return <span className="flex items-center text-amber-600 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Unresolved</span>;
      case 'Resolved': return <span className="flex items-center text-emerald-600 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolved</span>;
      case 'Ignored': return <span className="flex items-center text-slate-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5 mr-1" /> Ignored</span>;
    }
  };

  if (violations.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No violations found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Candidate</th>
              <th scope="col" className="px-6 py-4">Center</th>
              <th scope="col" className="px-6 py-4">Violation Type</th>
              <th scope="col" className="px-6 py-4">Time</th>
              <th scope="col" className="px-6 py-4">Severity</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((violation) => (
              <tr key={violation.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{violation.candidateName}</div>
                  <div className="text-xs font-mono text-slate-500">{violation.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  {violation.center}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {violation.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                  {violation.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSeverityBadge(violation.severity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(violation.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" title="Review Incident">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Button>
                    {violation.status === 'Unresolved' && (
                      <Button variant="outline" size="icon" className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" title="Mark as Resolved">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Need to import AlertCircle inside the file for the badge.
import { AlertCircle } from 'lucide-react';
