import React from 'react';
import { cn } from '@/utils/cn';
import type { MonitorStatus } from '../types';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface ConnectionBadgeProps {
  status: MonitorStatus;
  className?: string;
  showIcon?: boolean;
}

export function ConnectionBadge({ status, className, showIcon = true }: ConnectionBadgeProps) {
  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";
  let Icon = Wifi;

  switch (status) {
    case 'Online':
      badgeClasses = "bg-primary/10 text-primary border-primary/20";
      Icon = Wifi;
      break;
    case 'Poor Connection':
      badgeClasses = "bg-amber-50 text-amber-700 border-amber-200";
      Icon = AlertTriangle;
      break;
    case 'Offline':
      badgeClasses = "bg-red-50 text-red-700 border-red-200";
      Icon = WifiOff;
      break;
  }

  return (
    <div className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", badgeClasses, className)}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {status}
    </div>
  );
}
