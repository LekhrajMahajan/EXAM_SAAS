import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import type { BiometricRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Eye, ScanFace } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

interface BiometricTableProps {
  records: BiometricRecord[];
}

export function BiometricTable({ records }: BiometricTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>App No.</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium text-slate-900">{record.applicationNumber}</TableCell>
              <TableCell>{record.candidateName}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{record.centerId}</span>
                  <span className="text-xs text-slate-500">{record.roomId} / S-{record.seatNumber}</span>
                </div>
              </TableCell>
              <TableCell className="text-slate-600">{record.verificationType}</TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell>
                {record.verificationTime ? new Date(record.verificationTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={`/company/biometric/${record.id}`}>
                        <Eye className="mr-2 h-4 w-4 text-slate-500" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {(record.status === 'Pending' || record.status === 'Failed' || record.status === 'Manual Review Required') && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={`/company/biometric/check-in?appNo=${record.applicationNumber}`}>
                          <ScanFace className="mr-2 h-4 w-4 text-indigo-500" />
                          Capture Biometrics
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                No biometric records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
