import React from 'react';
import { SearchX, Inbox, AlertTriangle, FileQuestion, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/providers/theme-context';

interface EmptyStateProps {
  icon?: 'search' | 'inbox' | 'alert' | 'file' | 'shield';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function GenericEmptyState({ icon = 'inbox', title, description, actionLabel, onAction, className = '' }: EmptyStateProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const Icon = {
    search: SearchX,
    inbox: Inbox,
    alert: AlertTriangle,
    file: FileQuestion,
    shield: Shield,
  }[icon];

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${className}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <Icon className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
      </div>
      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{title}</h3>
      <p className={`text-sm max-w-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export const NoRecords = () => <GenericEmptyState title="No Records Found" description="There are no records to display in this view." />;
export const NoSearchResults = () => <GenericEmptyState icon="search" title="No Results" description="Try adjusting your search or filters to find what you're looking for." />;
