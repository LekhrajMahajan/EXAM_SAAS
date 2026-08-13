import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import type { AdmitCard } from '../types';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Printer, Eye, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Badge } from '@/shared/components/ui/badge';
import { Link } from 'react-router-dom';

interface AdmitCardTableProps {
  admitCards: AdmitCard[];
}

export function AdmitCardTable({ admitCards }: AdmitCardTableProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>App No.</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Exam</TableHead>
            <TableHead>Center / Room</TableHead>
            <TableHead>Seat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admitCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium text-slate-900">{card.applicationNumber}</TableCell>
              <TableCell>{card.candidateName}</TableCell>
              <TableCell>{card.examId}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{card.centerId}</span>
                  <span className="text-xs text-slate-500">{card.roomId}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{card.seatNumber}</TableCell>
              <TableCell>
                {card.status === 'Generated' && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Generated</Badge>}
                {card.status === 'Downloaded' && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Downloaded</Badge>}
                {card.status === 'Revoked' && <Badge className="bg-red-100 text-red-800 border-red-200">Revoked</Badge>}
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
                      <Link to={`/company/admit-cards/${card.id}`}>
                        <Eye className="mr-2 h-4 w-4 text-slate-500" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={`/company/admit-cards/${card.id}/preview`}>
                        <Printer className="mr-2 h-4 w-4 text-slate-500" />
                        Print Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4 text-slate-500" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {admitCards.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                No admit cards found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
