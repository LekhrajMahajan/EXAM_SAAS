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
import type { PaperApproval } from '../types';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { Link } from 'react-router-dom';
import { Eye, FileText, History } from 'lucide-react';

interface ApprovalTableProps {
  approvals: PaperApproval[];
}

export const ApprovalTable: React.FC<ApprovalTableProps> = ({ approvals }) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper Code</TableHead>
            <TableHead>Paper Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Review Status</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Approver</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                No approvals found.
              </TableCell>
            </TableRow>
          ) : (
            approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell className="font-medium text-slate-700">{approval.paperCode}</TableCell>
                <TableCell>{approval.paperName}</TableCell>
                <TableCell>{approval.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                    {approval.version}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-transparent">
                    {approval.reviewStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ApprovalStatusBadge status={approval.approvalStatus} />
                </TableCell>
                <TableCell className="text-slate-600">{approval.approver || 'Unassigned'}</TableCell>
                <TableCell className="text-slate-500">
                  {new Date(approval.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/company/paper-approval/${approval.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/company/paper-approval/${approval.id}/approve`}>
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Approval Workspace">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/company/paper-approval/history?paperId=${approval.paperId}`}>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700 hover:bg-slate-100" title="History">
                        <History className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
