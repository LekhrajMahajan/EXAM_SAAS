import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';
import type { Paper } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface PaperTableProps {
  papers: Paper[];
}

export const PaperTable: React.FC<PaperTableProps> = ({ papers }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      default: return 'secondary';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'destructive';
      default: return 'warning';
    }
  };

  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper Code</TableHead>
            <TableHead>Paper Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Marks / Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-slate-500">
                No papers found.
              </TableCell>
            </TableRow>
          ) : (
            papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-medium">{paper.code}</TableCell>
                <TableCell>{paper.name}</TableCell>
                <TableCell>{paper.subject}</TableCell>
                <TableCell>{paper.questions.length}</TableCell>
                <TableCell>
                  {paper.totalMarks} <span className="text-slate-400">/</span> {paper.duration}m
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(paper.status) as any}>{paper.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getApprovalColor(paper.approvalStatus) as any}>{paper.approvalStatus}</Badge>
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
                      <DropdownMenuItem onClick={() => navigate(`/company/papers/${paper.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/company/papers/${paper.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Paper
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
