import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { SubjectStatus } from '../types';

interface SubjectStatusBadgeProps {
  status: SubjectStatus;
  className?: string;
}

export function SubjectStatusBadge({ status, className = '' }: SubjectStatusBadgeProps) {
  if (status === 'Active') {
    return (
      <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${className}`}>
        Active
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className={`bg-gray-50 text-gray-700 border-gray-200 ${className}`}>
      Inactive
    </Badge>
  );
}
