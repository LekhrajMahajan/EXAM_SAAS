import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

export function SectionCard({ title, description, icon: Icon, children }: SectionCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden mb-6">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
         <CardTitle className="text-lg flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
            {title}
         </CardTitle>
         {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">
         {children}
      </CardContent>
    </Card>
  );
}
