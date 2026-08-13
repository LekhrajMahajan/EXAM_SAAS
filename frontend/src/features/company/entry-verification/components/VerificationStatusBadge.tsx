import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { VerificationStatus } from '../types';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationStatusBadge({ status, className }: VerificationStatusBadgeProps) {
  switch (status) {
    case 'Verified':
      return (
        <Badge variant="outline" className={cn("bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 font-medium", className)}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </Badge>
      );
    case 'Pending':
      return (
        <Badge variant="outline" className={cn("bg-slate-100 text-slate-700 border-slate-200 gap-1.5 font-medium", className)}>
          <Clock className="w-3.5 h-3.5" />
          Pending
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge variant="outline" className={cn("bg-red-50 text-red-700 border-red-200 gap-1.5 font-medium", className)}>
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </Badge>
      );
    case 'Hold':
      return (
        <Badge variant="outline" className={cn("bg-amber-50 text-amber-700 border-amber-200 gap-1.5 font-medium", className)}>
          <AlertCircle className="w-3.5 h-3.5" />
          Hold
        </Badge>
      );
    default:
      return null;
  }
}
