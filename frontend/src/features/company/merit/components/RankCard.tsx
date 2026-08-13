import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/utils/cn';
import { Trophy, Medal, Star } from 'lucide-react';

interface RankCardProps {
  label: string;
  rank: number | undefined;
  type?: 'overall' | 'category' | 'state' | 'city';
  className?: string;
}

export function RankCard({ label, rank, type = 'category', className }: RankCardProps) {
  if (rank === undefined) return null;

  let icon = <Star className="w-5 h-5 text-slate-400" />;
  let colorClass = "bg-slate-100 text-slate-700";
  
  if (type === 'overall') {
    icon = <Trophy className="w-6 h-6 text-amber-500" />;
    colorClass = "bg-amber-50 border-amber-200 text-amber-900 shadow-sm";
  } else if (type === 'category') {
    icon = <Medal className="w-5 h-5 text-indigo-500" />;
    colorClass = "bg-indigo-50 border-indigo-100 text-indigo-900";
  } else if (type === 'state') {
    icon = <Medal className="w-5 h-5 text-emerald-500" />;
    colorClass = "bg-emerald-50 border-emerald-100 text-emerald-900";
  }

  return (
    <Card className={cn("border-slate-200", colorClass, className)}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
             <span className="text-xl font-bold">#</span>
             <span className="text-3xl font-extrabold">{rank}</span>
          </div>
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
