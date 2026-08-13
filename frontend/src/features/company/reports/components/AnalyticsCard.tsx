import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AnalyticsCard({ title, description, children }: AnalyticsCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
           <BarChart3 className="w-4 h-4 text-indigo-500" />
           {title}
        </CardTitle>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-center">
        {children}
      </CardContent>
    </Card>
  );
}
