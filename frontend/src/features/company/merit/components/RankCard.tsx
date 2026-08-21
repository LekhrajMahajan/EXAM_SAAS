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

  let icon = <Star className="w-5 h-5 text-muted-foreground" />;
  let colorClass = "bg-muted text-foreground border-border";
  
  if (type === 'overall') {
    icon = <Trophy className="w-6 h-6 text-primary" />;
    colorClass = "bg-primary/10 border-primary/20 text-primary shadow-sm";
  } else if (type === 'category') {
    icon = <Medal className="w-5 h-5 text-blue-500" />;
    colorClass = "bg-blue-500/10 border-blue-500/20 text-blue-600";
  } else if (type === 'state') {
    icon = <Medal className="w-5 h-5 text-emerald-500" />;
    colorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600";
  }

  return (
    <Card className={cn("border", colorClass, className)}>
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
