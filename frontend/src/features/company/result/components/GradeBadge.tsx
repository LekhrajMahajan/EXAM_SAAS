import React from 'react';
import { cn } from '@/utils/cn';
import type { Grade } from '../types';

interface GradeBadgeProps {
  grade: Grade;
  className?: string;
}

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (grade === 'A+' || grade === 'A') {
    badgeClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (grade === 'B+' || grade === 'B') {
    badgeClasses = "bg-blue-100 text-blue-800 border-blue-200";
  } else if (grade === 'C') {
    badgeClasses = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (grade === 'D' || grade === 'F') {
    badgeClasses = "bg-red-100 text-red-800 border-red-200";
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border", badgeClasses, className)}>
      {grade}
    </span>
  );
}
