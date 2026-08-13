import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertBannerProps {
  type: AlertType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({ type, title, message, onDismiss, className = '' }: AlertBannerProps) {
  const config = {
    info: { icon: Info, wrapper: 'bg-sky-50 border-sky-200', text: 'text-sky-800', iconColor: 'text-sky-500' },
    success: { icon: CheckCircle, wrapper: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', iconColor: 'text-emerald-500' },
    warning: { icon: AlertTriangle, wrapper: 'bg-amber-50 border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-500' },
    error: { icon: AlertCircle, wrapper: 'bg-rose-50 border-rose-200', text: 'text-rose-800', iconColor: 'text-rose-500' },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${config.wrapper} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={`text-sm font-bold ${config.text} mb-1`}>{title}</h4>}
        <p className={`text-sm ${config.text} opacity-90`}>{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className={`p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity ${config.text}`}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function InlineMessage({ type, message }: { type: AlertType, message: string }) {
  const color = {
    info: 'text-sky-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-rose-600',
  }[type];

  return <p className={`text-xs font-medium mt-1 ${color}`}>{message}</p>;
}
