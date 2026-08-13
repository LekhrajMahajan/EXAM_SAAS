import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { cn } from '@/utils/cn';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  iconClassName?: string;
  className?: string;
  action?: React.ReactNode;
}

export function DashboardCard({ title, value, description, icon: Icon, iconClassName, className, action }: DashboardCardProps) {
  return (
    <Card className={cn("border-slate-200 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-md bg-slate-100", iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && (
            <p className="text-xs text-slate-500">
              {description}
            </p>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
