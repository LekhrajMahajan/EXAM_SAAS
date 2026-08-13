import React from 'react';
import type { StatusConfig } from '../../types';

export function StatusBadge({ config, className = '' }: { config: StatusConfig, className?: string }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[config.variant]} ${className}`}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ level }: { level: 'Low' | 'Medium' | 'High' | 'Critical' }) {
  const config: Record<string, StatusConfig> = {
    Low: { label: 'Low', variant: 'default' },
    Medium: { label: 'Medium', variant: 'info' },
    High: { label: 'High', variant: 'warning' },
    Critical: { label: 'Critical', variant: 'error' },
  };
  return <StatusBadge config={config[level] || config.Low} />;
}

export function SeverityBadge({ level }: { level: 'Low' | 'Medium' | 'High' | 'Critical' }) {
  return <PriorityBadge level={level} />;
}

export function ApprovalBadge({ status }: { status: 'Pending' | 'Approved' | 'Rejected' | 'Draft' }) {
  const config: Record<string, StatusConfig> = {
    Draft: { label: 'Draft', variant: 'default' },
    Pending: { label: 'Pending Review', variant: 'warning' },
    Approved: { label: 'Approved', variant: 'success' },
    Rejected: { label: 'Rejected', variant: 'error' },
  };
  return <StatusBadge config={config[status] || config.Draft} />;
}
