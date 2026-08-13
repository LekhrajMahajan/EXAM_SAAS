import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Shift } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit, MoreHorizontal, CalendarDays, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SessionBadge } from './SessionBadge';

interface ShiftTableProps {
  shifts: Shift[];
}

export const ShiftTable: React.FC<ShiftTableProps> = ({ shifts }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Shift Code</TableHead>
            <TableHead>Name / Exam</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date / Time</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                No shifts found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700">
                    {shift.general.code}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-800">{shift.general.name}</div>
                  <div className="text-xs text-slate-500">{shift.general.examId}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">{shift.general.centerId}</div>
                  <div className="text-xs text-slate-500">{shift.general.cityId}, {shift.general.stateId}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-slate-800">
                    {new Date(shift.schedule.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {shift.schedule.examStartTime} - {shift.schedule.examEndTime}
                  </div>
                </TableCell>
                <TableCell>
                  <SessionBadge session={shift.schedule.session} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(shift.assignedCandidates / shift.capacity.maxCapacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {shift.assignedCandidates}/{shift.capacity.maxCapacity}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(shift.status)}`}>
                    {shift.status}
                  </Badge>
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/company/shifts/${shift.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> Overview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/company/shifts/${shift.id}/calendar`)}>
                        <CalendarDays className="mr-2 h-4 w-4" /> Calendar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/company/shifts/${shift.id}/capacity`)}>
                        <Users className="mr-2 h-4 w-4" /> Capacity
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/company/shifts/${shift.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Shift
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
