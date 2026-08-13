import React from 'react';
import { BarChart3, PieChart, LineChart, Activity, Map } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ChartPlaceholderProps {
  type: 'bar' | 'pie' | 'line' | 'activity' | 'map';
  title?: string;
  className?: string;
}

export function ChartPlaceholder({ type, title, className }: ChartPlaceholderProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'pie': return <PieChart className="w-12 h-12 text-slate-300 mb-2" />;
      case 'line': return <LineChart className="w-12 h-12 text-slate-300 mb-2" />;
      case 'activity': return <Activity className="w-12 h-12 text-slate-300 mb-2" />;
      case 'map': return <Map className="w-12 h-12 text-slate-300 mb-2" />;
      case 'bar':
      default:
        return <BarChart3 className="w-12 h-12 text-slate-300 mb-2" />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg min-h-[250px]", className)}>
       {getIcon()}
       <p className="text-sm font-medium text-slate-500 text-center">
         {title || `Interactive ${type} chart placeholder.`}
       </p>
       <p className="text-xs text-slate-400 mt-1">Data visualization will render here.</p>
    </div>
  );
}
