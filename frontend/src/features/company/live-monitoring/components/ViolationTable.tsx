import React from 'react';
import type { ViolationRecord, ViolationSeverity } from '../types';
import { cn } from '@/utils/cn';
import { Button } from '@/shared/components/ui/button';
import { Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ViolationTableProps {
  violations: ViolationRecord[];
}

export function ViolationTable({ violations }: ViolationTableProps) {
  
  const getSeverityBadge = (severity: ViolationSeverity) => {
    switch(severity) {
      case 'Critical': return <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider border border-destructive/20">Critical</span>;
      case 'High': return <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider border border-orange-500/20">High</span>;
      case 'Medium': return <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider border border-yellow-500/20">Medium</span>;
      case 'Low': return <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border border-border">Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Unresolved': return <span className="flex items-center text-destructive text-xs font-medium"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Unresolved</span>;
      case 'Resolved': return <span className="flex items-center text-primary text-xs font-medium"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolved</span>;
      case 'Ignored': return <span className="flex items-center text-muted-foreground text-xs font-medium"><XCircle className="w-3.5 h-3.5 mr-1" /> Ignored</span>;
    }
  };

  if (violations.length === 0) {
    return (
      <div className="text-center p-12 bg-card border border-border border-dashed rounded-xl flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-muted rounded-full">
          <AlertCircle className="w-6 h-6 text-muted-foreground opacity-50" />
        </div>
        <p className="text-muted-foreground font-medium">No violations found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs text-foreground uppercase bg-muted/50 border-b border-border">
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
              <tr key={violation.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-foreground">{violation.candidateName}</div>
                  <div className="text-xs font-mono text-muted-foreground">{violation.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  {violation.center}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                  {violation.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
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
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-card" title="Review Incident">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    {violation.status === 'Unresolved' && (
                      <Button variant="outline" size="icon" className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary bg-card" title="Mark as Resolved">
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
