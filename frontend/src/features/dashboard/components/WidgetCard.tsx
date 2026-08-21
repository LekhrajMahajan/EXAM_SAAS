import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function WidgetCard({ title, children, action, className = '' }: WidgetCardProps) {
  return (
    <Card className={`border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full ${className}`}>
      <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 space-y-0">
        <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
}
