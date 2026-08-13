import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected' | 'Re-upload Requested';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className = '' }: DocumentStatusBadgeProps) {
  switch (status) {
    case 'Verified':
      return (
        <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 flex items-center gap-1 ${className}`}>
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge variant="outline" className={`bg-red-50 text-red-700 border-red-200 flex items-center gap-1 ${className}`}>
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      );
    case 'Re-upload Requested':
      return (
        <Badge variant="outline" className={`bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1 ${className}`}>
          <AlertCircle className="w-3 h-3" />
          Re-upload Requested
        </Badge>
      );
    case 'Pending':
    default:
      return (
        <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 ${className}`}>
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
  }
}
