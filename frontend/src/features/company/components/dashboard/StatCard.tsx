import { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  colorClass?: string;
  accent?: 'slate' | 'green' | 'lime' | 'amber' | 'red';
}

const ACCENT_MAP = {
  green: { border: 'border-slate-200 dark:border-slate-800', num: 'text-slate-900 dark:text-white' },
  lime: { border: 'border-slate-200 dark:border-slate-800', num: 'text-slate-900 dark:text-white' },
  slate: { border: 'border-slate-200 dark:border-slate-800', num: 'text-slate-900 dark:text-white' },
  amber: { border: 'border-amber-200 dark:border-amber-500/40', num: 'text-amber-600 dark:text-amber-500' },
  red: { border: 'border-red-200 dark:border-red-500/40', num: 'text-red-600 dark:text-red-500' },
};

const useAnimatedNumber = (end: number, duration = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

export const StatCard = ({ title, value, icon: Icon, description, trend, accent = 'slate' }: StatCardProps) => {
  const a = ACCENT_MAP[accent] || ACCENT_MAP.slate;
  const isNumber = typeof value === "number" || (!isNaN(Number(value)) && typeof value === "string" && value.trim() !== "");
  const numVal = isNumber ? Number(value) : 0;
  const animatedValue = useAnimatedNumber(numVal, 1200);

  const displayValue = isNumber ? animatedValue.toLocaleString("en-IN") : value;

  return (
    <Card className={`border ${a.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card text-card-foreground`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
              {title}
            </p>
            <div className={`text-2xl font-bold mt-1 ${a.num}`}>
              {displayValue}
            </div>
            {description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {description}
              </p>
            )}
            {trend && (
              <p className="text-xs mt-1.5 flex items-center gap-1">
                <span className={cn(
                  "font-semibold", 
                  trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}>
                  {trend.isPositive ? "+" : "-"}{trend.value}%
                </span>
                <span className="text-slate-400 text-[11px]">{trend.label}</span>
              </p>
            )}
          </div>
          <div className="p-1.5 rounded-md bg-[#E4FD97] text-[#2D3E2C] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

