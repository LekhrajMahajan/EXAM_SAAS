import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import type { BiometricHistoryLog } from '../types';
import { StatusBadge } from './StatusBadge';

interface HistoryTableProps {
  history: BiometricHistoryLog[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Verified By</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                <div className="font-medium text-slate-900">{log.date}</div>
                <div className="text-xs text-slate-500">{log.time}</div>
              </TableCell>
              <TableCell>{log.candidateName}</TableCell>
              <TableCell className="text-slate-600">{log.verificationType}</TableCell>
              <TableCell>
                <StatusBadge status={log.result} />
              </TableCell>
              <TableCell>{log.verifiedBy}</TableCell>
              <TableCell className="text-slate-500 max-w-xs truncate">
                {log.remarks || '-'}
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
