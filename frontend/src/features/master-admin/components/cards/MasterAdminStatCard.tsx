import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'

export interface MasterAdminStatCardProps {
  title: string
  value: number | string | React.ReactNode
  prefix?: string
  suffix?: string
  icon: React.ElementType
  accent?: 'green' | 'lime' | 'red' | 'amber' | 'slate'
  description?: string
}

const ACCENT_MAP = {
  green: { border: 'border-slate-200', num: 'text-slate-900' },
  lime: { border: 'border-slate-200', num: 'text-slate-900' },
  slate: { border: 'border-slate-200', num: 'text-slate-900' },
  amber: { border: 'border-amber-200', num: 'text-amber-600' },
  red: { border: 'border-red-200', num: 'text-red-600' },
}

// Simple counter animation hook
const useAnimatedNumber = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart easing function
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

export const MasterAdminStatCard = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  accent = 'slate',
  description,
}: MasterAdminStatCardProps) => {
  const a = ACCENT_MAP[accent]
  
  const isNumber = typeof value === 'number';
  const animatedValue = useAnimatedNumber(isNumber ? (value as number) : 0, 1500);

  const displayValue = isNumber ? (
    `${prefix}${animatedValue.toLocaleString('en-IN')}${suffix}`
  ) : (
    value
  );

  return (
    <Card
      className={`border ${a.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
    >
      <CardContent className='p-5'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <p className='text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 line-clamp-2 leading-tight'>
              {title}
            </p>
            <div className={`text-2xl font-bold mt-1 ${a.num}`}>{displayValue}</div>
            {description && (
              <p className='text-[10px] text-slate-400 mt-1 line-clamp-2'>{description}</p>
            )}
          </div>
          <div className="p-1.5 rounded-md bg-[#E4FD97] text-[#2D3E2C] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
