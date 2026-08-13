import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp,
  colorClass = 'border-slate-200 bg-white' 
}) => {
  return (
    <Card className={`border-l-4 shadow-sm ${colorClass}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {trend && (
              <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </p>
            )}
          </div>
          <div className="p-3 bg-slate-50 rounded-full text-slate-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
