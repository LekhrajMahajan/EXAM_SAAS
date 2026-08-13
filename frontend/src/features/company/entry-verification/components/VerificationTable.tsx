import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import type { VerificationRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Eye, UserCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { VerificationStatusBadge } from './VerificationStatusBadge';

interface VerificationTableProps {
  verifications: VerificationRecord[];
}

export function VerificationTable({ verifications }: VerificationTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>App No.</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Exam Info</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium text-slate-900">{record.applicationNumber}</TableCell>
              <TableCell>{record.candidateName}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{record.examId}</span>
                  <span className="text-xs text-slate-500">{record.shiftId}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{record.centerId}</span>
                  <span className="text-xs text-slate-500">{record.roomId} / S-{record.seatNumber}</span>
                </div>
              </TableCell>
              <TableCell>
                <VerificationStatusBadge status={record.status} />
              </TableCell>
              <TableCell>
                {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '-'}
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
                      <Link to={`/company/entry-verification/${record.id}`}>
                        <Eye className="mr-2 h-4 w-4 text-slate-500" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {record.status === 'Pending' && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={`/company/entry-verification/check-in?appNo=${record.applicationNumber}`}>
                          <UserCheck className="mr-2 h-4 w-4 text-indigo-500" />
                          Verify Candidate
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {verifications.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                No verifications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
