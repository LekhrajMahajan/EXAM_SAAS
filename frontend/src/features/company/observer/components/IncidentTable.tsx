import React from 'react';
import type { IncidentReport } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Paperclip, Eye, MapPin } from 'lucide-react';

export function IncidentTable({ incidents }: { incidents: IncidentReport[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Incident Details</th>
              <th className="px-4 py-3 font-semibold">Location & Time</th>
              <th className="px-4 py-3 font-semibold">Reported By</th>
              <th className="px-4 py-3 font-semibold text-center">Severity</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{inc.incidentNumber}</span>
                    {inc.hasAttachment && <Paperclip className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">{inc.category}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]" title={inc.description}>{inc.description}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-slate-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {inc.room ? `${inc.center}, ${inc.room}` : inc.center}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 ml-4.5">{inc.reportedAt}</div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {inc.reportedBy}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={inc.severity} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={inc.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="h-8 bg-white text-xs">
                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
