import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import type { ShiftSchedule } from '../types';

interface SessionBadgeProps {
  session: ShiftSchedule['session'];
}

export const SessionBadge: React.FC<SessionBadgeProps> = ({ session }) => {
  const getSessionConfig = () => {
    switch (session) {
      case 'Morning':
        return { icon: <Sun className="w-3 h-3 mr-1" />, classes: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' };
      case 'Afternoon':
        return { icon: <Sunset className="w-3 h-3 mr-1" />, classes: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' };
      case 'Evening':
        return { icon: <Moon className="w-3 h-3 mr-1" />, classes: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200' };
      case 'Custom':
      default:
        return { icon: <Clock className="w-3 h-3 mr-1" />, classes: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200' };
    }
  };

  const { icon, classes } = getSessionConfig();

  return (
    <Badge variant="outline" className={`${classes} font-medium flex items-center w-fit`}>
      {icon}
      {session}
    </Badge>
  );
};
