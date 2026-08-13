import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { PaperApproval } from '../types';

interface ApprovalStatusBadgeProps {
  status: PaperApproval['approvalStatus'];
}

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  const getBadgeVariant = () => {
    switch (status) {
      case 'Approved':
        return 'default'; // Assuming default maps to a primary/success color depending on theme, or we can use specific classes
      case 'Rejected':
        return 'destructive';
      case 'Returned':
        return 'destructive';
      case 'In Review':
        return 'secondary';
      case 'Pending':
      default:
        return 'outline';
    }
  };

  const getCustomClass = () => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
      case 'Returned':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
      case 'In Review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
      case 'Pending':
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200';
    }
  };

  return (
    <Badge variant={getBadgeVariant()} className={`${getCustomClass()} font-medium`}>
      {status}
    </Badge>
  );
};
