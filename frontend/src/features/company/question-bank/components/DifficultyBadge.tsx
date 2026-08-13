import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { DifficultyLevel } from '../types';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  switch (level) {
    case 'Easy':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Easy</Badge>;
    case 'Medium':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
    case 'Hard':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Hard</Badge>;
    default:
      return <Badge variant="outline">{level}</Badge>;
  }
}
