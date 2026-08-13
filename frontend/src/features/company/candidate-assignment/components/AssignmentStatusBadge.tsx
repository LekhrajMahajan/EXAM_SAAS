import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { AssignmentStatus } from '../types';

interface AssignmentStatusBadgeProps {
  status: AssignmentStatus;
}

export function AssignmentStatusBadge({ status }: AssignmentStatusBadgeProps) {
  switch (status) {
    case 'Assigned':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200">Assigned</Badge>;
    case 'Pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200">Pending</Badge>;
    case 'Error':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
