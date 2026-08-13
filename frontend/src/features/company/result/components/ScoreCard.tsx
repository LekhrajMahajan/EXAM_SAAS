import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/utils/cn';

interface ScoreCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function ScoreCard({ label, value, icon, trend, className }: ScoreCardProps) {
  return (
    <Card className={cn("border-slate-200 shadow-sm", className)}>
      <CardContent className="p-4 flex items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
             <p className="text-xl font-bold text-slate-900">{value}</p>
             {trend === 'up' && <span className="text-xs font-bold text-emerald-600">↑</span>}
             {trend === 'down' && <span className="text-xs font-bold text-red-600">↓</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
