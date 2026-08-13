import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let badgeVariant = "outline";
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case 'Approved':
    case 'Verified':
    case 'Available':
    case 'Pass':
    case 'Issued':
      badgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case 'Draft':
    case 'Pending':
    case 'Under Review':
    case 'Pending Generation':
      badgeClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case 'Rejected':
    case 'Fail':
    case 'Withheld':
      badgeClasses = "bg-red-50 text-red-700 border-red-200";
      break;
  }

  return (
    <Badge variant="outline" className={cn(badgeClasses, "font-medium", className)}>
      {status}
    </Badge>
  );
}
