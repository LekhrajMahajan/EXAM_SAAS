import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import type { AssignmentHistoryLog } from '../types';
import { Badge } from '@/shared/components/ui/badge';

interface HistoryTableProps {
  history: AssignmentHistoryLog[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Exam / Shift</TableHead>
            <TableHead>Center</TableHead>
            <TableHead className="text-right">Total Assigned</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {new Date(log.date).toLocaleString()}
              </TableCell>
              <TableCell>{log.assignedBy}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{log.examId}</span>
                  <span className="text-xs text-slate-500">{log.shiftId}</span>
                </div>
              </TableCell>
              <TableCell>{log.centerId}</TableCell>
              <TableCell className="text-right font-mono">{log.totalAssigned}</TableCell>
              <TableCell>
                {log.status === 'Success' && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200">Success</Badge>}
                {log.status === 'Partial' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200">Partial</Badge>}
                {log.status === 'Failed' && <Badge className="bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200">Failed</Badge>}
              </TableCell>
            </TableRow>
          ))}
          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                No history logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
