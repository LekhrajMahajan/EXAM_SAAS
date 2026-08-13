import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { AssignmentStatusBadge } from './AssignmentStatusBadge';
import type { CandidateAssignment } from '../types';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';

interface AssignmentTableProps {
  assignments: CandidateAssignment[];
}

export function AssignmentTable({ assignments }: AssignmentTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>App No.</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Exam</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Center / Room</TableHead>
            <TableHead>Seat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium text-slate-900">{assignment.applicationNumber}</TableCell>
              <TableCell>{assignment.candidateName}</TableCell>
              <TableCell>{assignment.examId}</TableCell>
              <TableCell>{assignment.shiftId}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{assignment.centerId}</span>
                  <span className="text-xs text-slate-500">{assignment.roomId}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{assignment.seatNumber || '-'}</TableCell>
              <TableCell>
                <AssignmentStatusBadge status={assignment.status} />
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4 text-slate-500" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4 text-slate-500" />
                      Re-assign
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Unassign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {assignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                No assignments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
