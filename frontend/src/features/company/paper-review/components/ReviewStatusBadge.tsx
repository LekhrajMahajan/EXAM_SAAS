import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { PaperReview } from '../types';

interface ReviewStatusBadgeProps {
  status: PaperReview['status'];
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    case 'In Progress':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
    case 'Completed':
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'Returned':
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Returned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
