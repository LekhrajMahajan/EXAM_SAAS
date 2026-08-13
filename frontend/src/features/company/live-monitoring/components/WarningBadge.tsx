import React from 'react';
import { cn } from '@/utils/cn';
import { AlertTriangle } from 'lucide-react';

interface WarningBadgeProps {
  count: number;
  className?: string;
}

export function WarningBadge({ count, className }: WarningBadgeProps) {
  if (count === 0) return null;

  let badgeClasses = "bg-amber-50 text-amber-700 border-amber-200";

  if (count >= 3) {
    badgeClasses = "bg-red-50 text-red-700 border-red-200 font-bold";
  }

  return (
    <div className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", badgeClasses, className)} title={`${count} Warnings`}>
      <AlertTriangle className="w-3 h-3 mr-1" />
      {count} Warnings
    </div>
  );
}
